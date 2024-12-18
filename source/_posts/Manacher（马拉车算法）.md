---
title: Manacher（马拉车算法）
tags: 
	- ACM
toc: true
date: 2024-12-02 16:03:52 
description: 计算最长回文子序列
---
# 代码
```cpp
#include<cstdio>
#include<iostream>
#include<cstring>
#include<cmath>
using namespace std;
#define INT 22000007
char c[INT];//拓展后的偶字符串
int p[INT];//拓展得到的回文串长度

int manacher_init(char* s,char* c){
	int l=strlen(s);
	int cnt=0;
	c[++cnt]='~';
	c[++cnt]='#';
	for (int i = 0; i < l; ++i)
	{
		c[++cnt]=s[i];
		c[++cnt]='#';
	}
	c[++cnt]='!';
	return cnt;
}//拓展来省去奇偶讨论
int manacher(char* s){
	int cnt=manacher_init(s,c);
	int mid=0,mr=0,ans=0;
	for (int i = 2; i < cnt; ++i)
	{
			if(i<=mr)p[i]=min(p[mid*2-i],mr-i+1);
			else p[i]=1;
			while(c[i-p[i]]==c[i+p[i]]){
				p[i]++;
			}
			if(i+p[i]>mr){
				mr=i+p[i]-1;
				mid=i;
			}
			ans=max(ans,p[i]);
	}
	return ans-1;
}
int main(){
	char s[1300];
	
	while(scanf("%s",s)!=EOF){
		cout<<manacher(s);
	}
	
}
```
# 原理速查
1. 对每一个点作为对称中心拓展，得到一个最长回文长度
2. 查询每个点时，如果这个点在目前已知回文串中就去找这个回文串的中心点，找到该点对称的点，查询这个点的回文串长，这个数字是这个点能拓展出的最小值，以他作为起始再去拓展这个点。
3. 注意拓展的长度不能超过已知右端点最右回文串的范围。