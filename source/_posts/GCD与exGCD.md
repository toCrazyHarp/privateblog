---
title: GCD与exGCD
tags: 
	- ACM
toc: true
date: 2024-11-15 20:57:53 
description: 解决最大公约数问题
---

``` cpp
#inlcude<cstdio>
int gcd(int a,int b){
	return b?gcd(b,a%b):a;
}
int main(){
    return 0;
}
```


