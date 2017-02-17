---
date: "2017-02-11T16:15:16-05:00"
title: "Site redesign!"
---
I rebuilt the site with a from-scratch Hugo theme. Styles are assembled from LESS with a Gulp task runner.
Afterwards, static assets are revision-hashed, and markup is reformatted.

## Hugo

[Hugo](https://gohugo.io/) is a super fast, easily installed static site generator. It's a lot like [Jekyll](https://jekyllrb.com/), GitHub's Ruby-powered static site generator. But it brings with it a lot of the Golang philosophy, and unlike Jekyll, Hugo doesn't let you twist its arm into doing a lot of extra stuff like image processing or stylesheet building. It does one thing, templating, really well and really fast. You can do the rest of the stuff on the side.

## The Rest of the Stuff

I wanted to write the site styles in LESS, my favorite CSS preprocessor. I used the node LESS compiler with Gulp, the trendiest available task runner. (Kidding, I like Gulp. File streams are a neat idea and worked great for me on this project.) I also really wanted to build an SVG sprite from files included in the theme. To do that, I used `gulp-svgstore`. Just out-of-the-box it worked great.
