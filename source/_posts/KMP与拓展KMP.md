---
title: KMP与拓展KMP
tags: 
	- ACM
	- 字符串算法
toc: true
date: 2024-12-03 16:44:32 
description: 字串匹配
---

# 代码
## kmp（字符数组版本）
```cpp
#include<cstdio>
#include<cstring>
#include<iostream>
using namespace std;
#define INT 1000006
int nextl[INT];
char s[INT],t[INT];
void kmp_init(char* b,int l){
	int p=0;
	nextl[1]=0;
	for (int i = 2; i <= l; ++i)
	{
		while(p&&b[i]!=b[p+1])p=nextl[p];
		if(b[p+1]==b[i])p++;
		nextl[i]=p;
	}
	return;
}//构造next数组
void kmp(char* a,char* b,int la,int lb){
	kmp_init(b,lb);
	int p=0;
	for (int i = 1; i <= la; ++i)
	{
		while(p&&b[p+1]!=a[i])p=nextl[p];
		if(b[p+1]==a[i])p++;
		if(p==lb){
			cout<<i-lb+1<<'\n';
			p=nextl[p];
		}
	}
	//cout<<lb<<'\n' ;
	for (int i = 1; i <= lb; ++i)
	{
		cout<<nextl[i]<<' ';
	}
	return;
}
int main(){
	cin>>(s+1)>>(t+1);
	int ls=strlen(s+1);
	int lt=strlen(t+1);
	kmp(s,t,ls,lt);
	return 0;
}
```
## kmp字符串版本



## exkmp
```cpp
#include<iostream>
#include<cstring>
using namespace std;
int next[1000],lent,lenp,extend[1000];
char text[1000],part[1000];
void get_next()
{
   int j=0,i=0,p,l,k;
   next[0]=lenp;
   while(j<lenp&&part[j]==part[j+1])
    j++;
   next[1]=j;
    k=1;
   for(i=2;i<lenp;i++)
   {
       p=next[k]+k-1,l=next[i-k];
       if(l+i-1<p)
        next[i]=l;
       else
       {
           j=max(0,p+1-i);
           while(i+j<lenp&&part[j]==part[i+j])
            j++;
           next[i]=j;
           k=i;
       }
   }
}
int extend_KMP()
{
    int i,j=0,l,k=0,p;
    get_next();
    while(j<lent&&j<lenp&&part[j]==text[j])
        j++;
    extend[0]=j;
    for(i=1;i<lent;i++)
    {
        l=next[i-k];
        p=extend[k]+k-1;
        if(l+i-1<p)
            extend[i]=l;
        else
        {
            j=max(0,p+1-i);
            while(j+i<lent&&part[j]==text[i+j])
                j++;
            extend[i]=j;
            k=i;
        }
    }
}
int main()
{
    int i;
   cin>>part>>text;
   lenp=strlen(part);
   lent=strlen(text);
   extend_KMP();
   for(i=0;i<lenp;i++)
    cout<<next[i];
   cout<<endl;
   for(i=0;i<lent;i++)
   cout<<extend[i];
   return 0;
}
```
# 原理速查
## KMP
* 寻找子串出现位置
next数组：指向下一个匹配位置，具体的值是［0，i ］的最长公共前后缀长度。
next数组为递归求解，不断缩小调整。
运行时在失配处i把匹配指针指向next[i]，效率O(n)
## EXKMP
* 寻找每个位置开头的字串与模式串的公共前缀长度
extend数组（模式串性质序列），指与当前位置为首的子串与模式串的最长公共前缀