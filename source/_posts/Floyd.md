---
title: Floyd
tags: 
	- ACM
toc: true
date: 2024-12-02 15:54:32 
description: 多元最短路算法
---
计算多元最短路
```cpp
#include<cstdio>
#define NLINK 100000
int n,m;
int sot[102][102]={NLINK};
int min(int a,int b){
	return a<b?a:b;
}
void init(){
	//默认极大值表示未连接，看情况更换值
	scanf("%d%d",&n,&m);
	for (int i = 1; i <= n; ++i)
	{
		for (int j = 1; j <= n; ++j)
		{
			if(i==j){
				sot[i][j]=0;
				//初始化，到自己的距离
			}
			else sot[i][j]=NLINK;
			//其他默认不相连
		}
	}
}
void floyd(){
	for (int i = 1; i <= n; ++i)
	{
	//为了全部遍历，这里把中间点放在第一层循环里
		for (int j = 1; j <= n; ++j)
		{
			for (int k = 1; k <= n; ++k)
			{
				sot[j][k]=min(sot[j][k],sot[j][i]+sot[i][k]);
			}
		}
	}
}
int main(){
	for (int i = 0; i < m; ++i)
	{
		int a,b,c;
		scanf("%d%d%d",&a,&b,&c);
		//A到B有一条C的路，这里是在处理重边，sot[i][j]是在处理自环
		if(a!=b){
		//这里是双向边，u而就是说这里是无向图
			sot[a][b]=min(c,sot[a][b]);
			sot[b][a]=min(c,sot[b][a]);
		}
	}
	//以上就是创建多元最短路矩阵
	for (int i = 1; i <= n; ++i)
	{
		for (int j = 1; j <= n; ++j)
		{
			printf("%d ",sot[i][j] );
		}
		printf("\n");
	}
}
```