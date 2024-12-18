---
title: Dijkstra
tags: 
	- ACM
toc: true
date: 2024-12-02 15:45:24 
description: 单源最断路
---

一般情况下，堆优化Dijkstra已经足够使用，效率为((U+E)logU)
# 堆优化+链式前向星
```cpp
struct edge{
	int to;
	int dis;
	int next;
}edge[INT];
long long head[N],dis[N],tot;
int vis[N];
int n,m,s;
void add(int from,int to,int dist){
	tot++;
	edge[tot].dis=dist;
	edge[tot].to=to;
	edge[tot].next=head[from];
	head[from]=tot;
}//链式前向星
struct node {
	int dis;
	int pos;
	bool operator <(const node &x)const{
		return x.dis< dis;
	}
};
void dijkstra(int start){
	priority_queue<node> q;
	dis[start]=0;
	q.push((node){0,start});
	while(!q.empty()){
		node temp=q.top();
		q.pop();
		int x=temp.pos;
		//int d=temp.dis;
		if(vis[x]){
			continue;
		}
		vis[x]=1;
		for (int i = head[x]; i ; i=edge[i].next)
		{
			int y=edge[i].to;
			if(dis[y]>dis[x]+edge[i].dis){
				dis[y]=dis[x]+edge[i].dis;
				if(!vis[y]){
					q.push((node){dis[y],y});
				}
			}
		}
	}
}
signed main(){
	int u,v,d;
	scanf("%d%d%d",&n,&m,&s);
	for (int i = 1; i <= n; ++i)
	{
		dis[i]=0x3f3f3f;
	}
	for (int i = 0; i < m; ++i)
	{
		scanf("%d%d%d",&u,&v,&d);
		add(u,v,d);//有向边
	}
	dijkstra(s);
	for (int i = 1; i <= n; ++i)
	{
		printf("%lld ",dis[i]);
	}
}
```
# 线段树优化
```cpp
int tree[N<<2],leaf;
/*线段树存的是点的标号*/
int check(int i,int j){
  return dis[i]<dis[j]?i:j;
}
void build(){
  memset(dis,inf,sizeof(dis));
  for(leaf=1;leaf<=n;leaf<<=1);--leaf;
  for(int i=1;i<=n;++i) tree[leaf+i]=i;
}
/*修改 dis[x] 为 y*/
void change(int x,int y){
  dis[x]=y,x+=leaf,x>>=1;
  while(x) tree[x]=check(tree[x<<1],tree[x<<1|1]),x>>=1;
}
void Dijikstra(int s){
  build();
  dis[s]=0;
  int u=s;
  for(int i=1;i<=n;++i){
    ans[u]=dis[u];
    change(u,max_int); /*删除u*/
    for(int e=pre[u];e;e=nx[e]){
      const int v=to[e];
      if(dis[v]>ans[u]+w[e])
        change(v,ans[u]+w[e]);
    }
    u=tree[1];
  }
}

```