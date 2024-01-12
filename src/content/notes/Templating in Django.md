---
title: Templating in Django
description: A quick overview on Django Templates
author: Urban
---

## Templates [¶](https://docs.djangoproject.com/en/5.0/ref/templates/language/#templates "Permalink to this headline")

A template is a text file. It can generate any text-based format (HTML, XML, CSV, etc.).

A template contains **variables**, which get replaced with values when the template is evaluated, and **tags**, which control the logic of the template.

Below is a minimal template that illustrates a few basics. Each element will be explained later in this document.

```django
{% extends "base_generic.html" %}

{% block title %}
	{{ section.title }}
{% endblock %}

{% block content %}
	<h1>{{ section.title }}</h1>
	{% for story in story_list %}
	<h2>
	  <a href="{{ story.get_absolute_url }}">
	    {{ story.headline|upper }}
	  </a>
	</h2>
	<p>{{ story.tease|truncatewords:"100" }}</p>
	{% endfor %}
{% endblock %}
```

> Philosophy
> Why use a text-based template instead of an XML-based one (like Zope’s TAL)? We wanted Django’s template language to be usable for more than just XML/HTML templates. You can use the template language for any text-based format such as emails, JavaScript and CSV.

> If you use a variable that doesn’t exist, the template system will insert the value of the `string_if_invalid` option, which is set to `''` (the empty string) by default.

### Behind the Scenes

Technically, when the template system encounters a dot, it tries the following lookups, in this order:

- Dictionary lookup
- Attribute or method lookup
- Numeric index lookup

If the resulting value is callable, it is called with no arguments. The result of the call becomes the template value.

This lookup order can cause some unexpected behavior with objects that override dictionary lookup. For example, consider the following code snippet that attempts to loop over a `collections.defaultdict`:

```django
{% for k, v in defaultdict.items %}
    Do something with k and v here...
{% endfor %}
```

Because dictionary lookup happens first, that behavior kicks in and provides a default value instead of using the intended `.items()` method. In this case, consider converting to a dictionary first.

## Filters [¶](https://docs.djangoproject.com/en/5.0/ref/templates/language/#filters "Permalink to this headline")

### `default`

If a variable is false or empty, use given default. Otherwise, use the value of the variable. For example:

```django
{{ value|default:"nothing" }}
```

If `value` isn’t provided or is empty, the above will display “`nothing`”.

### `filesizeformat`

Formats the value like a “human-readable” file size (i.e. `'13 KB'`, `'4.1 MB'`, `'102 bytes'`, etc.)

### `length`

Gives the length of a value

## Tags [¶](https://docs.djangoproject.com/en/5.0/ref/templates/language/#tags "Permalink to this headline")

[Tag Reference](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#ref-templates-builtins-tags)

> Tags look like this: `{% tag %}`. Tags are more complex than variables: Some create text in the output, some control flow by performing loops or logic, and some load external information into the template to be used by later variables.
> Some tags require beginning and ending tags (i.e. `{% tag %} ... tag contents ... {% endtag %}`).

### `for`

Loop over each item in an array

**Example**

```django
<ul>
	{% for athlete in athlete_list %}
	    <li>{{ athlete.name }}</li>
	{% endfor %}
</ul>
```

### `if`, `elif`, & `else`

**Example**

```django
{% if athlete_list %}
    Number of athletes: {{ athlete_list|length }}
{% elif athlete_in_locker_room_list %}
    Athletes should be out of the locker room soon!
{% else %}
    No athletes.
{% endif %}
```

## Comments

```django
{# This is a comment #}
```

## Template Inheritance [¶](https://docs.djangoproject.com/en/5.0/ref/templates/language/#template-inheritance "Permalink to this headline")

### Parent Component

The parent component will define the blocks that need to be filled

> In this example, the [`block`](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#std-templatetag-block) tag defines three blocks that child templates can fill in. All the [`block`](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#std-templatetag-block) tag does is to tell the template engine that a child template may override those portions of the template.

```django
<!DOCTYPE html>
<html lang="en">
	<head>
	    <link rel="stylesheet" href="style.css">
	    <title>{% block title %}My amazing site{% endblock %}</title>
	</head>

	<body>
	    <div id="sidebar">
	        {% block sidebar %}
	        <ul>
	            <li><a href="/">Home</a></li>
	            <li><a href="/blog/">Blog</a></li>
	        </ul>
	        {% endblock %}
	    </div>

	    <div id="content">
	        {% block content %}
	        {% endblock %}
	    </div>
	</body>
</html>
```

### Child Component

A child component must `extend` the parent component with

> Note that since the child template didn’t define the `sidebar` block, the value from the parent template is used instead. Content within a `{% block %}` tag in a parent template is always used as a fallback.

```django
{% extends "base.html" %}

{% block title %}
	This is my title
{% endblock %}

{% block content %}
	......
{% endblock %}
```

### Common Strategy

> One common way of using inheritance is the following three-level approach:
>
> - Create a `base.html` template that holds the main look-and-feel of your site.
> - Create a `base_SECTIONNAME.html` template for each “section” of your site. For example, `base_news.html`, `base_sports.html`. These templates all extend `base.html` and include section-specific styles/design.
> - Create individual templates for each type of page, such as a news article or blog entry. These templates extend the appropriate section template.
> - This approach maximizes code reuse and helps to add items to shared content areas, such as section-wide navigation.

### Tips for Inheritance

> Here are some tips for working with inheritance:
>
> - If you use [`{% extends %}`](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#std-templatetag-extends) in a template, it must be the first template tag in that template. Template inheritance won’t work, otherwise.
>
> - More [`{% block %}`](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#std-templatetag-block) tags in your base templates are better. Remember, child templates don’t have to define all parent blocks, so you can fill in reasonable defaults in a number of blocks, then only define the ones you need later. It’s better to have more hooks than fewer hooks.
>
> - If you find yourself duplicating content in a number of templates, it probably means you should move that content to a `{% block %}` in a parent template.
>
> - If you need to get the content of the block from the parent template, the `{{ block.super }}` variable will do the trick. This is useful if you want to add to the contents of a parent block instead of completely overriding it. Data inserted using `{{ block.super }}` will not be automatically escaped (see the [next section](https://docs.djangoproject.com/en/5.0/ref/templates/language/#automatic-html-escaping)), since it was already escaped, if necessary, in the parent template.
>
> - By using the same template name as you are inheriting from, [`{% extends %}`](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#std-templatetag-extends) can be used to inherit a template at the same time as overriding it. Combined with `{{ block.super }}`, this can be a powerful way to make small customizations. See [Extending an overridden template](https://docs.djangoproject.com/en/5.0/howto/overriding-templates/#extending-an-overridden-template) in the *Overriding templates* How-to for a full example.
>
> - Variables created outside of a [`{% block %}`](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#std-templatetag-block) using the template tag `as` syntax can’t be used inside the block. For example, this template doesn’t render anything:

```django
{% translate "Title" as title %}
{% block content %}{{ title }}{% endblock %}
```

> - For extra readability, you can optionally give a *name* to your `{% endblock %}` tag. For example:

```django
{% block content %}
	...
{% endblock content %}
```

> - In larger templates, this technique helps you see which `{% block %}` tags are being closed.
> - [`{% block %}`](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#std-templatetag-block) tags are evaluated first. That’s why the content of a block is always overridden, regardless of the truthiness of surrounding tags. For example, this template will *always* override the content of the `title` block:

```django
{% if change_title %}
	{% block title %}Hello!{% endblock title %}
{% endif %}
```

> Finally, note that you can’t define multiple [`block`](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#std-templatetag-block) tags with the same name in the same template. This limitation exists because a block tag works in “both” directions. That is, a block tag doesn’t just provide a hole to fill – it also defines the content that fills the hole in the *parent*. If there were two similarly-named [`block`](https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#std-templatetag-block) tags in a template, that template’s parent wouldn’t know which one of the blocks’ content to use.
