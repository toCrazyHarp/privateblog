---
title: Clion配置C++多库开发环境
tags: 
- 
toc: true
date: 2025-03-10 23:42:57 
description: 以OpenGL为例
---
作为老牌的IDE，使用Clion进行C/C++开发，是一个非常常见的事情，但是在面对项目的时候，如何安装库以及依赖，在互联网上却很难找到教程。本文以OpenGL开发中安装glfw，glew，glm等相关库为例，演示在windows环境使用Clion时的相关技巧与步骤。
# 准备
* 稳定的win系统
* Clion
* 稳定访问github的网络环境/国内镜像源

>在进行环境配置的时候需要从GitHub上频繁拉取文件，请尽量保持网络条件通畅，否则会遇到极大的阻力。

# 步骤
1. 安装clion等基本软件
2. 安装包管理插件
clion提供了两种包管理工具，vcpkg和Conan，其中vcpkg已经被集成到clion中，Conan作为插件，是可安装选项。基于发挥IDE本身特性的原则，使用vcpkg。
当然也可以进行手动文件配置，但是其中有各种各样的配置步骤，又有编译程序名不一致等问题，解决起来不胜其烦，索性弃之。
在clion的工具栏中的更多里找到vcpkg（也可以在菜单栏里找到或者使用搜索功能：双击shift->action->输入vcpkg）
3. 点击加号，新建一个vcpkg库，勾选==add vcpkg integration to existing profiles==，如果使用国内镜像则设置url为镜像源
4. 进入manifest mode，这一步为了解决编译程序名的问题，当出现编译不一致的情况时会有如下报错：
~~~text
Cannot specify link libraries for target "main" which is not built by this project.
~~~
这里原因在于编译时的函数名与项目名称不一致，需要修改cmakelist相关内容，这里按下不表。
5. 搜索并将相关库勾选，若显示成功加入json中则为添加成功。
6. 开始编辑Cmakelist：
> 内容如下
> 在下载库后会有编辑至Cmakelist的选项
> 如果没有，请查看Cmake控制台，寻找添加指引
>其内容形如：

~~~cmake
The package glm provides CMake targets:

    find_package(glm CONFIG REQUIRED)
    target_link_libraries(main PRIVATE glm::glm)

    # Or use the header-only version
    find_package(glm CONFIG REQUIRED)
    target_link_libraries(main PRIVATE glm::glm-header-only)

~~~

7.添加之后，在main.cpp中运行如下代码，检查是否正确运行
~~~cpp
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <iostream>
using namespace std;

#define numVAOs 1

GLuint renderingProgram;
GLuint vao[numVAOs];

GLuint createShaderProgram() {
	const char *vshaderSource =
		"#version 430    \n"
		"void main(void) \n"
		"{ gl_Position = vec4(0.0, 0.0, 0.0, 1.0); }";

	const char *fshaderSource =
		"#version 430    \n"
		"out vec4 color; \n"
		"void main(void) \n"
		"{ color = vec4(0.0, 0.0, 1.0, 1.0); }";

	GLuint vShader = glCreateShader(GL_VERTEX_SHADER);
	GLuint fShader = glCreateShader(GL_FRAGMENT_SHADER);
	GLuint vfprogram = glCreateProgram();

	glShaderSource(vShader, 1, &vshaderSource, NULL);
	glShaderSource(fShader, 1, &fshaderSource, NULL);
	glCompileShader(vShader);
	glCompileShader(fShader);
		
	glAttachShader(vfprogram, vShader);
	glAttachShader(vfprogram, fShader);
	glLinkProgram(vfprogram);

	return vfprogram;
}

void init(GLFWwindow* window) {
	renderingProgram = createShaderProgram();
	glGenVertexArrays(numVAOs, vao);
	glBindVertexArray(vao[0]);
}

void display(GLFWwindow* window, double currentTime) {
	glUseProgram(renderingProgram);
	glPointSize(30.0f);
	glDrawArrays(GL_POINTS, 0, 1);
}

int main(void) {
	if (!glfwInit()) { exit(EXIT_FAILURE); }
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	GLFWwindow* window = glfwCreateWindow(600, 600, "Chapter 2 - program 2", NULL, NULL);
	glfwMakeContextCurrent(window);
	if (glewInit() != GLEW_OK) { exit(EXIT_FAILURE); }
	glfwSwapInterval(1);

	init(window);

	while (!glfwWindowShouldClose(window)) {
		display(window, glfwGetTime());
		glfwSwapBuffers(window);
		glfwPollEvents();
	}

	glfwDestroyWindow(window);
	glfwTerminate();
	exit(EXIT_SUCCESS);
}
~~~
如果运行成功，则表示安装完成
# 常见报错
## 在运行vcpkg的时候遇到网络错误
报错往往如下：
~~~git
git clone --progress https://github.com/microsoft/vcpkg "vcpkg (1)"
Cloning into 'vcpkg'...
fatal: unable to access 'https://github.com/microsoft/vcpkg/': Could not resolve host: github.com
~~~
这是网络问题，目前网络无法正常访问github，请选用合适的网络或者使用国内镜像源。

## 没有编辑Cmakelist链接到库
报错类似如下
~~~text
Graphic.exe : fatal error LNK1120: 13 个无法解析的外部命令
~~~
请核实前面的报错位置使用的库函数是否包含在cmakelist中。
## 多次修改关键内容还是存在同一库连接问题
请检查是否执行reload Cmakelist，右键Cmakelist文件菜单或者控制台的Cmake页面。

