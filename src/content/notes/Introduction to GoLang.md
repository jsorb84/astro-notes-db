---
title: Intro to GoLang
author: Urban
description: Basic Intro to Go Language
keywords: go, programming, notes
tags: ["Go", "Notes"]
coverImage: https://cdn.thenewstack.io/media/2022/05/57bb2a1f-golang.png
---

## Primary Resource

[**Go By Example**](https://gobyexample.com/)

## Hello World

```go
package main

import "fmt"

func main() {
	helloString := "Hello World"
	fmt.Println(helloString);
}
```

## Variables

```go
var myVar string = "String"
var myInt int = 5
// Without Type
int := 5
```

## Arrays, Lists, Ranges

### Arrays

```go
var arr [5]int // Int array of size 5
var twoArr [2][3]int
```

### Slices

[Blog Post on Slices](https://go.dev/blog/slices-intro)

**Unlike arrays, slices are typed only by the elements they contain (not the number of elements). An uninitialized slice equals to nil and has length 0.**

To create an empty slice with non-zero length, use the builtin `make`. Here we make a slice of `string`s of length `3` (initially zero-valued). By default a new slice’s capacity is equal to its length; if we know the slice is going to grow ahead of time, it’s possible to pass a capacity explicitly as an additional parameter to `make`.

```go
import (
	"slices"
)

func main() {
	var s []string
	// also
	s = make([]string, 3) // Cap is 3
}
```

### Maps

```go
import (
	"maps"
)
func main() {
	m := make(map[string]int)
	// Makes a Map = string => int

}
```

### Range

*range* iterates over elements in a variety of data structures. Let’s see how to use `range` with some of the data structures we’ve already learned.

```go
func main() {
	nums := []int{2,3,4}
	sum := 0
	for _, num := range nums {
		if num == 3 {
			// Do Something
		}
	}

	for i, num := range nums {
		// ...
	}

	someMap := map[string]string{"a": "apple", "b": "Banana"}
	for k, v := range someMap {
		// K = Key V = Value
	}
}
```

## Functions

```go
func myFunction(a int, b string, c []string) bool {
	if(a == 1 && b == "Some String")
		return true
	return false
}

```

## Pointers

A pointer is a memory address.

```go
import "fmt"

func myFunc(a *int) {
	// This function takes a which is a pointer to an int
	fmt.Println(a) // Prints mem address
	fmt.Println(*a) // Use * to translate back into int
}

func main() {
	var myInt int = 5
	// Using & operator gives memory address
	fmt.Println(&myInt) // 0x34234234 example

	myFunc(myInt) // Does not work
	myFunc(&myInt) // Works

}
```

## Structs

```go
type person struct {
    name string
    age int
}

func newPerson(name string) *person {
	// Return a pointer to the new person
    someone := person{name: "Josh"}
    return &someone
}

func main() {
	// myPerson is a pointer, use * to make into person
    myPerson := newPerson("Josh")
   
    fmt.Println((*myPerson).age)
    dog := struct {
	    name string
	    isGood bool
    }{
	    "Rex",
	    true
    }
}
```
