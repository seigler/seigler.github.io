---
date: "2017-02-11T16:15:16-05:00"
title: "Site redesign!"
---
I rebuilt the site with a from-scratch Hugo theme. Styles are assembled from LESS with a Gulp task runner.
Afterwards, static assets are revision-hashed, and markup is reformatted.

## Hugo

[Hugo](https://gohugo.io/) is a super fast, easily installed static site generator. It's a lot like [Jekyll](https://jekyllrb.com/), GitHub's Ruby-powered static site generator. But it brings with it a lot of the Golang philosophy, and unlike Jekyll, Hugo doesn't let you twist its arm into doing a lot of extra stuff like image processing or stylesheet building. It does one thing, templating, really well and really fast. You can do the rest of the stuff on the side.

## The Rest of the Stuff

I wanted to write the site styles in LESS, my favorite CSS preprocessor. I used the node LESS compiler with Gulp, the trendiest available task runner. (Kidding, I like Gulp. File streams are a neat idea and worked great for me on this project.)

## Styles

This design in particular was a pain to get right. I had to find the right perspective and transform settings to distort the screen just right, even when the document was resized. I learned that the `<body>` tag ignores most `transform` properties, so there isn't a way to have the page scroll _with perspective_ and keep the scrollbar in the normal place on the right edge of the viewport.
