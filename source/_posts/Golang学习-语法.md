---
title: Go语言语法学习
tags: 
- 碎碎念
toc: true
date: 2025-08-18 23:55:22
type: normal
description: 学习的一点记录，与实际我在笔记软件上写的不一样
---
# 写在最前
这是一篇golang的学习笔记，目的旨在写完这篇之后能够流畅的阅读golang代码
# 基本语句
## 语句
Go的语句与C语言不同，不以任何符号结尾。但是如果想要在一行之内写多个语句，可以像C一样使用分号分割，但是不推荐。
## 赋值
与C等类型不同的是，golang的变量类型是后置的。
格式如下：
~~~go
var num int =20
var name string
//支持不指定类型，由编译器决定，但是不推荐
~~~
单个语句声明多个变量
~~~go
var {
name int
adress,telephone string
}
name = 1
adress = "Beijing"
// 同样支持列表声明
var name1,name2,name3 = 1,2,3
name1,name2,name3 := 1,2,3
~~~
变量简短格式声明
~~~go
goodname := "sentences"
//注意这里没有var，而类型是由编译器自动推断的
~~~
常量声明
~~~go
const name int =15
const s = "sentences"
~~~
* 所有变量，声明后一定要使用，否则会报错，常量可以声明但是不使用。

数组声明：
~~~go
var name [SIZE] type ={}
~~~

结构体声明：
~~~go
type name struct {
……
}
~~~
特别的，结构体指针引用成员时，只需要使用.即可
map类型引用：
~~~go
var name map[keytype]valuetype
name = make(map[keytype]valuetype)
//检查元素是否存在
captial, ok := countryCapitalMap["United States"]
//ok为ture就存在
//map有删除函数delete(mapname,deletekey)
~~~
go中有类似java的接口类型：
~~~go
type name interface{
	funcname returntype
	……
}
~~~
在struct使用接口时，不需要明确继承接口，只需要实现所有以自己类为参数的同名函数即可。
## 变量值类型
1. 数值类变量默认为0
2. 溢出的精度默认截断
3. string类型重载了”+“
4. 运算符与C基本保持一致，没有三元运算符
5. go的bool值没有与正整数映射，类型无法转换
6. go类型仅支持同类的精度转换，无法跨类型转换
7. 所有的类型转换必须显性，保证数据安全

go中的类型主要是bool，数值，字符串，及其衍生（指针，数组，结构体，联合，函数等）
特殊的iota，iota是一个类似C中enum的外置实现，具体的，iota每出现一次，就要加一
有以下使用：
~~~go
const{
	a=iota
	b=iota
	c=iota
}
const{
	a=iota
	b
	b
}
~~~
上边的程序相互等价，一个有趣的简写。原理是在列表声明式，缺省值默认为上方最近的有效值。
## 运算
1. go语言中，自增减号及其衍生只能作为一个单独语句使用而非表达式
## 注释
go的注释与C一致
~~~go
// 单行注释
/* 多
行
注
释
*/
~~~
# 分支语句
go中有四种分支语句：if，if-else，switch，select。
前三种与C保持一致，这里特别介绍select
select与信道通信有关，select有若干信道通信case，他会同时求出所有case的值，然后随机进入一个case中，特别的，当没有case予以通过时，将会进入死锁直到有一个case成立。

# 循环语句
go的循环语句覆盖了C的for与while，有如下：
~~~go
for init; contidition; post;{ }
for conditions { }//等效于C的while(condition)
for { }//等效于C的for(;;){ }
//迭代器写法
for value,value2 := range arr { }
//与C++的for(auto a: arr){ }类似
~~~
range函数：
对于各个类型，有以下规则：
rage Type

| T | idx1 |idx2|
| --- | --- |---|
| arr,slic | 索引 |值|
|map|key|val|
|channel|元素|Null|



# 函数
go的函数由以下格式构成
~~~go
func fucname ([para list])returntype{ }
~~~
返回值依然后置，同时可以不写，作为void。
paralist 和 returntype都支持列表。同时paralist支持同类型的类型声明合并。
go语言和C一样，参数默认值传递，可以通过指针实现引用传递
go支持如java或者cpp类似的匿名函数。
形如：func（）int{}
## defer语句
defer语句是一种异步语句，用来在顺序语句编程内调整顺序。
defer可以延迟一个语句，当代码块由多个defer是，内部有专门的栈，调用按照栈顺序，即先进后出。
# 切片类型
go中有类似vector的东西，即动态数组，称为切片。
声明格式如下：
~~~go
var name []type
~~~
可以通过make函数初始化，make函数类型声明如下：
make(\[\]T,len,capacity)
capacity：最长长度，len初始长度，cap可以缺省
重载了\[\]运算符，可以用以下语法定义切片：arr\[st_idx:ed_idx\],两个参数都可缺省，与python规则保持一致。
切片本身也支持这个运算符。
# 多线程
并发：同时段内多个任务
并行：同一时刻多个任务
## goroutine
go的多线程基于gorountine，
使用很简单，对一个函数前使用go修饰词就可以，每一个goroutine对应一个函数/方法，以及对于匿名函数同样可用。
同步执行函数
sync.waitgroup，一个waitgroup就是一个计数器，有一个wait方法，在计数器归零前会一直阻塞程序，等待线程完成，同时有add，done两个方法负责加一/减一，同时运行的线程，在宏观上是同时的，实际上是随机运行的。使用waitgroup，可以人工划定一些顺序。来维持可能的相互通信。
## channel
管道类是一种类似于模电管线一样的东西，可以实现不同运行时之间的通信。每一个channel值负责一种数据类型。
channel有三种操作，发送，接受，关闭。这里关闭时禁止向channel发送信息的意思。
写法如下：
~~~go
var a chan int
//一个int类型的管道
a <-10
//向管道发送数据
x :=<-a
<-a
//从管道取值
~~~
channel分两类：有缓冲和无缓冲，这里先介绍后者。
### 无缓冲channel
首先值得说明的是，channel是线程间的操作，所以在没进行完相关活动的这段时间内，会把线程阻塞起来，所以如果涉及到main线程，记得注意挂起的问题，防止死锁。
无缓冲channel的含义代表了所有的传递过程必须是当时完成的，没有中间步骤。当某一个线程对channel执行发送/接受操作时，这个线程会被挂起，知道另一个线程对其接受/发送，完成通信，这时才会继续运行两个线程。
~~~go
package main

import "fmt"

func receive(x chan int) {
	ret := <-x
	fmt.Println("接收成功", ret)
}

func main() {
	a := make(chan int)
	go receive(a)
	a <- 10
	fmt.Println("发送成功")
}
~~~
### 有缓冲channel
在初始化channel的时候可以指定其容量，也就是对应的缓存区大小，与无缓存不同的是，可以向管道不断发送信息，只有管道满了之后依然发送才会发生堵塞。
~~~go
package main

import "fmt"

func main() {
	a := make(chan int,1)
	a <- 10
	fmt.Println("发送成功")
}
//程序可以正常运行
~~~
### 判断channel非空
~~~go
value, ok := <-ch
//当ok为false时表示以空，value时对应类型的默认值。
~~~
### 单向通道
在定义时可以指定数据流通方式
~~~go
var name <- chan int//只出不进
var name chan <- int//只进不出
~~~
### 同时处理多个channel
可以是使用select关键字，在多个case中选择进行，只有在所有case都被挂起的时候，主程序才会被阻塞，友多个case可以执行的时候，随机执行一个。
## mutex
mutex就是传统多线程里的线程锁
使用方法如下：
~~~go
var lk sync.Mutex
lk.Lock()//加锁
lk.Unlock()//解锁
~~~
对于mutex对象，当有多个线程的函数持有同一个mutex对象时，同时只会执行一个线程，其他运行到锁的线程会被挂起，没有锁的线程正常运行。
## RWMtuex
读写锁，使用于适应绝大多数操作都为读取的操作。
RWMtuex有两种对象，使用如下
~~~go
var rwlk sync.RWMutex
rwlk.RLock()
rwlk.RUnlock()
//读锁
rwlk.Lock()
rwlk.Unlock()
//写锁
~~~
读写锁依照以下逻辑运行
1. 在没有线程占据写锁的时候，所有读锁并行运行
2. 在有线程占据读锁的时候，写锁挂起等待读锁完成运行
3. 在有线程写锁的时候，读锁写锁全部挂起等待
这样可以在有大量读取操作的时候，保证运行效率的同时保证数据安全。