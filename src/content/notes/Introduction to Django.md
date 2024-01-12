---
title: Intro to Django
author: Urban
---

## [Django Documentation](https://docs.djangoproject.com/en/5.0/)

## New Django App

```ts
// Install Django
pip install django
// Start a new Project
django-admin startproject "name"
// Create an App
django-admin startapp "name"
```

### Add your App to `settings.py`

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Add your app
    'firstapp.apps.FirstappConfig'
]
```

## First View

To create a view, navigate to the app directory, and open `views.py`

```python
from django.http import HttpResponse
def index(request):
	return HttpResponse("Hello World")
```

### Add View to `urls.py`

```python
from django.urls import path
# Import your views
from firstapp import views
app_name = 'MyApp'
urlpatterns = [
	path('', views.index, name='index')
]
```

## Templating

All templates are stored in your `(app)/templates` folder. Make sure you add your app to the `settings.py` file.

```django
<!-- (app)/templates/index.html -->
<b>Hello, {{ name }}</b>
```

### Update `views.py`

```python
from django.shortcuts import render
def index(request):
	context = dict(name="Josh")
	return render(request, "index.html", context)
```

## URL Variables

### `urls.py`

```python
from django.urls import path
app_name = "MyApp"
urlpatterns = [
   path('', views.index, name='index'),
   # Creates an 'int' typed variable called `postId`
   path('path/<int:postId>/', views.post, name='post')
]
```

### Path converters [¶](https://docs.djangoproject.com/en/5.0/topics/http/urls/#path-converters "Permalink to this headline")

The following path converters are available by default:

- `str` - Matches any non-empty string, excluding the path separator, `'/'`. This is the default if a converter isn’t included in the expression.
- `int` - Matches zero or any positive integer. Returns an `int`.
- `slug` - Matches any slug string consisting of ASCII letters or numbers, plus the hyphen and underscore characters. For example, `building-your-1st-django-site`.
- `uuid` - Matches a formatted UUID. To prevent multiple URLs from mapping to the same page, dashes must be included and letters must be lowercase. For example, `075194d3-6885-417e-a8a8-6c931e272f00`. Returns a [`UUID`](https://docs.python.org/3/library/uuid.html#uuid.UUID "(in Python v3.12)") instance.
- `path` - Matches any non-empty string, including the path separator, `'/'`. This allows you to match against a complete URL path rather than a segment of a URL path as with `str`.

### `views.py`

```python
# Notice the view takes the postId as a arg
def post(request, postId):
	context = dict(postId=postId)
	return render(request, "post/index.html", context)
```

### `/post/index.html`

```django
<body>
Viewing Post {{ postId }}
</body>
```
