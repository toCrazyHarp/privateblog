---
title: Pug（Jade）从入门到跑路
tags: 
- 学习
toc: true
date: 2025-08-16 18:45:13
type: normal
description: 关于pug的知识总结/实战分析
---
# 写在最前
本文是关于pug的技术/语法汇总，内容偏向全面，含有语法介绍/实例分析等部分。
如果想要完全阅读本文，建议您具有HTML/CSS/Javascript知识，了解vue等前端框架的基本形式更佳。
# pug是什么，你为什么需要pug
> PUG（前称Jade）是一种高性能的模板引擎，它使用简洁的语法来描述HTML结构。PUG模板引擎以其速度快和语法简洁而受到开发者的喜爱。
> 
> pug基于Node JS，它使用一种简洁的语法来编写HTML。PUG的设计理念是减少模板代码的冗余，提高代码的可读性和编写效率。PUG模板最终被编译成HTML，因此它们可以直接用于Web页面的渲染。

换言之，pug是一种HTML的替代体，vue中有与之占据相同位置的存在，其**与HTML的关系在于**，pug是一种通过引入变量与js语法的前端技术，通过“渲染”（编译），生成最终表现在浏览器上的HTML。在纯静态的HTML上进行了一层动态封装，**为HTML代码提供了可复用的能力**。体现一种动态/模板的能力，提高HTML编写效率，减少编码量。
> 巧妙地说，可以pug看作py in HTML，可以看出很多思想接近的地方。


# JS相关
作为最突出的特点，了解了pug引入了什么动态内容，才能更好的了解静态部分。
## 变量
基本的赋值语句：
~~~pug
- var variablename = value
~~~
与js语法保持一致，不指定类型。
## 分支
pug提供了两种分支：case和if，与一般的编程语言的switch/if对应。
~~~pug
- var friends = 10
case friends
  when 0
    p 您没有朋友
  when 1
    p 您有一个朋友
  default
    p 您有 #{friends} 个朋友
// 第二种写法
- var friends = 1
case friends
  when 0: p 您没有朋友
  when 1: p 您有一个朋友
  default: p 您有 #{friends} 个朋友
~~~
与常见编程语言不同的是，这里的分支的停止条件是遇到第一个非空代码块，倘若想要什么都不输出，才需要使用-break
~~~pug
- var user = { description: 'foo bar baz' }
- var authorised = false
#user
  if user.description
    h2.green 描述
    p.description= user.description
  else if authorised
    h2.blue 描述
    p.description.
      用户没有添加描述。
      不写点什么吗……
  else
    h2.red 描述
    p.description 用户没有描述
~~~
if作为常用的语句，在pug里设置了语法糖，前方加不加-，有没有括号都可以。非常自由
pug提供了if的相反语句==unless== 等价于if not
## 循环
### -的含义
本质上，-是一个不输出语句的标记，使用-标记的代码/代码块都不会输出，而是作为动态部分处理。
对应的，=是一个有输出语句的标志，同样对代码块生效。！=是不转义输出，后者在后文有详细说明。
### 迭代的两种方式
pug的两种循环为each/while，对标for/while
~~~pug
ul
  each val in [1, 2, 3, 4, 5]
    li= val
- var values = [];
ul
  each val in values
    li= val
  else
    li 没有内容
ul
  each val, index in ['〇', '一', '二']
    li= index + ': ' + val
- var n = 0;
ul
  while n < 4
    li= n++
~~~
与js基本保持一致。值得说的是else，语句在循环没有对象的时候运行。
## 嵌入
在pug中的嵌入语法是\#{}，{}内部可以是任何js表达式，换言之可以说{}内外的信息是隔离的，有js域和html域，需要通过特别的语法才能访问js域的值，方法就是嵌入或者逻辑代码，赋值记号等。
当然，嵌入的内容都是通过js转义的，如果不想要转义，可以使用！{}记号，{}内的内容就不会被转义了。
嵌入也可以实现段内插入其他标签，如em，strong
~~~pug
p.
  这是一个很长很长而且还很无聊的段落，还没有结束，是的，非常非常地长。
  突然出现了一个 #[strong 充满力量感的单词]，这确实让人难以 #[em 忽视]。
p.
  使用带属性的嵌入标签的例子：
  #[q(lang="es") ¡Hola Mundo!]
~~~
# 基本语法
## 标签
pug中有所有的HTML标签支持，使用缩进表示嵌套关系，可以自动识别自闭合标签，适应多种格式。
~~~pug
div 
	p 这是一个内层元素
	a(href="www.baidu.com") 这是一个网页链接
~~~
上边的代码可以渲染成为
~~~HTML
<div>
	<p>这是一个内层元素</p>
	<a href="www.baidu.com">这是一个网页链接</a>
</div>
~~~
当然，如果元素内部属性过多，也可以使用多行元素，pug会自动匹配括号。同时属性还可以传入一个json对象（模板字符串），括号内同时支持所有的合法js表达式。
~~~pug
input(  
type='checkbox'  
name='agreement'  
checked  
)
//模板字符串
input(data-json=`  
{  
"非常": "长的",  
"数据": true  
}  
`)
//js表达式
body(class=authenticated ? 'authed' : 'anon')
~~~
由于括号内支持所有合法js表达式，因此同样要避开关键字，可以使用双引号，单引号括起来，表明其不需要被js解析。
括号内同样支持模板字符串,与正常的js无差别。
当内容需要多行时，可以在标签后加一个.，表示内容为直接紧邻的代码块，代码块被视为纯文本，在写css和script时常用。
~~~pug
p.
  这是一个很长很长而且还很无聊的段落，还没有结束，是的，非常非常地长。
  saadadaasfa
~~~
值得说的是，.标识符单独出现时，所属直接的上一级，而包含下方的整个代码块。
## 属性转义
> 等号运算符"="如果用在标签上,表示将等号右边的内容用左边的标签包裹起来,无论在属性里还是在元素中,使用等号则意味着接受内容的转义,比如大于号变为& g t等。而使用”！=“不等号，则表示对内容不作转义处理，使用时需要小心，这样的写法可能会导致安全问题。

## 布尔值处理
pug中对布尔值做了映射，符合常用的编程规范，**默认为true**
## 注释
pug有两种注释类型，一种保留一种不保留
输出注释是保留的注释类型，代表在进行html渲染之后，作为html注释保留。即参与渲染变为\<!-- 这样--\>
不输出注释则表示不参与html渲染，在最后渲染的结果中不保留。仅属于pug文件。
两者写法如下
~~~pug
//输出注释
//- 不输出注释
~~~
两种注释方式的单位都是代码块，代表在缩进规则下都可以进行多行注释。
值得说的是，pug没有条件注释，可以直接写html代码来解决这个问题。
## 块展开
一种节省空间的写法，应用在嵌套标签中
~~~pug
a: img
~~~
# CSS相关
首先在pug的css与html没有明显差别，可以作为一个普通的属性，使用字符串定义，也可以使用json对象式的写法。
~~~pug
a(style={color: 'red', background: 'green'})
~~~
## 类
pug的类有三种写法
1. 类可以作为一个普通的属性使用，作为class的参数
2. 类可以填写一个含有多个类名的数组。
3. 类可以使用==.classname==的方法
~~~pug
- var classes = ['foo', 'bar', 'baz']  
a(class=classes)
a.button
~~~
值得说明是，.classname的方式有默认缺省值，值为div，换言之下面两句代码等价
~~~pug
div.maincontainer
||
.maincontainer
~~~
类名有一种特殊的动态机制，将类名绑定在以0，1为值的字典/有若干布尔值的json对象上，这时只会筛选出值为true的类使用
~~~pug
- var currentUrl = '/about'
a(class={active: currentUrl === '/'} href='/') Home
|
|
a(class={active: currentUrl === '/about'} href='/about') About
~~~
## ID
与类相似的，ID的写法为==\#IDname==
同上，id同样有div缺省补全。
## &attributes
pug支持将某个对象直接转换为元素的属性
~~~pug
- var attributes = {};
- attributes.class = 'baz';
div#foo(data-bar="foo")&attributes(attributes)
||
div#foo(data-bar="foo")&attributes({'data-foo': 'bar'})
~~~
# 特性
## doctype
doctype关键字放在文件开头，是解析方式的标识符，有以下值：
html，xml，transitional，strict，framset，1.1，basic，mobile，plist
同样的，也可以自定义
doctype html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN"
## 过滤器（Filter）
过滤器主要用于不同标记语法之间的相互转换，语法为==：JSTransformer（参数）==
~~~pug
:markdown-it(linkify langPrefix='highlight-')
  # Markdown

  Markdown document with http://links.com and

  ```js
  var codeBlocks;
  ```
script
  :coffee-script
    console.log 'This is coffee script'
~~~
过滤器可以按照顺序嵌套，类似管线的做法
~~~pug
script
  :cdata-js:babel(presets=['es2015'])
    const myFunc = () => `这是一行在 CD${'ATA'} 里的 ECMAScript 2015 代码`;
~~~
> 过滤器这里同样可以自定义，但是说实话感觉不会用上就暂时按下不表。

## 多文件
### 引用include
直接将文件在语句位置插入进去。
语法： include path
路径是与当前文件的相对路径。当文件不是pug文件的时候，会被当作纯文本拼接上去。但是支持过滤器
### 继承
类似于vue里的模板，相当于指定一个模板，留下若干空白来天空
语法
模板文件中：
block name
扩展文件中：
extend name.pug
block name1
……
block name2
……
block ……

* append，prepend两个关键词是改变默认行为，默认为直接替换，仅管在模板中有可以写一些默认内容，当继承者对于该块有内容的时候，就会直接替换掉默认内容，这两个关键字可以改变默认行为为前插/后插。
* 在使用append，prepend，可以省略block
## Mixin
mixin是pug的一种代码复用策略，允许灵活的生成某些通用代码块，允许使用参数，类似于参数的宏或者函数。
语法：
~~~pug
//- 定义
mixin list
  ul
    li foo
    li bar
    li baz
//- 使用
+list

mixin pet(name)
  li.pet= name
ul
  +pet('猫')
  +pet('狗')
  +pet('猪')
~~~
mixin也可以传递自己内部的代码块
~~~pug
mixin article(title)
  .article
    .article-wrapper
      h1= title
      if block
        block
      else
        p 没有提供任何内容。

+article('Hello world')

+article('Hello world')
  p 这是我
  p 随便写的文章
~~~
### Attributes参数传递
mixin的调用支持两个括号，第二个括号是属性，mixin内部可以隐式的获取一个参数attributes，一个属性集合对象。
值得注意的是，attributes在传入时已经转义，为防止二次转义，建议使用类似class！=attributes.class的表达，而这样的显然是不统一的，因此推荐使用&attributes（）方法。
~~~pug
mixin link(href, name)
  a(href=href)&attributes(attributes)= name

+link('/foo', 'foo')(class="btn")
~~~
### 剩余参数
mixin支持在最后接受不定长的参数到最后有记号的参数中
~~~pug
mixin list(id, ...items)
  ul(id=id)
    each item in items
      li= item

+list('my-list', 1, 2, 3, 4)
~~~
# 一些思考
html，css常被认为是静态的内容，也就是一旦被写下来就不在会变，引入js之后，出现了动态。我认为这个动态与pug支持的动态有区别，于初学者有混淆的可能，因而在此提出。
js的动态，发生在客户端，是在浏览器中，浏览器不断修改着页面属性，css等保留一些动画效果。这一系列过程都发生在浏览器中，实际上，pug实现的所有功能因为最后都会被转化为HTML，这意味着所有功能都可以手动编辑为html，也就是js可以完成所有pug的工作。
pug所谓的动态在生成html的步骤中，生成的东西就是一个普通的html文件，其能操纵的部分在服务器或者开发者出就被运行并保留结果，结果上，比起繁琐的写js，pug/vue等模板的存在快速简便的完成了大量基本任务。
总而言之，两者出现在信息从发生到被接收的不同阶段，将编译总量大大减少，减少性能消耗，高复用率的代码也减少了开发的难度。