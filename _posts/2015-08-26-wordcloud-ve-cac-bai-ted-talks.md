---
layout: post
title:  Wordcloud về các bài TED talks.
date:   2015-08-26
---
<p class="intro">TED (Technology, Entertainment, Design - nghĩa là *Công nghệ, giải trí, thiết kế*)là một chuỗi những buổi hội thảo toàn cầu được sở hữu bởi Sapling Foundation, một tổ chức tư nhân phi lợi nhuận. TED Talks bao gồm những bài diễn thuyết được ghi hình lại tại các sự kiện của TED hay tại các sự kiện độc lập TEDx diễn ra ở nhiều nơi trên thế giới.
</p>

Các bài diễn thuyết này đều có thể được xem miễn phí thông qua [trang web của TED](https://www.ted.com/talks/browse)

![Image of TED talks]({{ site.url }}/assets/img/TED-talks/Ted-talks-screenshot.png)

![Image of TED talks]({{ tulip4attoo.github.io }}/assets/img/TED-talks/Ted-talks-screenshot.png)


```
library("tm", lib.loc="~/R/win-library/3.2")
library("wordcloud", lib.loc="~/R/win-library/3.2")


ted = read.csv("TED.csv")

ted$Name = as.character(ted$Name)
ted$Name[92] = "Jeff Bezos: The electricity metaphor for the web's future"

```

```r

library("tm", lib.loc="~/R/win-library/3.2")
library("wordcloud", lib.loc="~/R/win-library/3.2")


ted = read.csv("TED.csv")

ted$Name = as.character(ted$Name)
ted$Name[92] = "Jeff Bezos: The electricity metaphor for the web's future"

```

<div style="width: 400px; height: 400px; padding-bottom: 30px;">
<script src="http://cdn.tagul.com/embed/fjahcvg6dves"></script>
<!-- Please don't remove attribution to Tagul.com -->
<div style="display: table; margin: 0 auto;"><a href="http://tagul.com/"></a></div>
</div>
