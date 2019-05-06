---
layout:         post
title:          TIR - Today I read - Some game tricks
date:           2018-05-06
mathjax:        true
comments:       true
description:    Nói về 2 video mình theo dõi, 1 là 1 số trick trong Dead cells để làm game nuột hơn, 2 là một trick về việc thiết kế graphic cho game.
img:            assets/img/tir/dead-cell.jpeg
author:         Tulip
---

## Về các tricks trong Dead cell

Dead cell là 1 game khó, nhưng nó là 1 game chơi sướng tay (game 2d platformer sướng tay bậc nhất mình từng chơi). rất nhiều tricks được implement trong quá trình thực hiện (hơn 40 theo nguồn hehe). À nguồn đây: 

{% include youtubePlayer.html id="LtBNffzWhf4" %}

Các trick được liệt kê:

- vẫn chấp nhận nhảy khi đã ra ngoài platform 1 chút (Just in Time jump), kỹ thuật này thì nhiều chỗ nói qua
- các kỹ thuật bám tường và chạy tiếp khi tường không quá cao, điều này giúp tọa được tiết tấu nhanh cho game. Chấp nhận chạm đất kể cả khi vẫn còn rìa rìa.
- tự động rotation trong 1 số trường hợp
- psudo random trong việc generate map. Ví dụ như thiết kế cấu trúc map, chỉ có các component thì được chọn trong 1 dict (cũng đã được hand-crafted trước).
- cả prj chỉ có 8 người, đôi lúc có ít người hơn.
- việc chấp nhận Early access giúp có nhiều review, feedbacks và những thứ này có tác động lớn và tốt.

## Về tricks trong thiết kế graphic cho game

{% include youtubePlayer.html id="xMgNBP8yJeU" %}

Just keep it simple. Chú ý trong việc lựa chọn các màu để phối hợp

That's all for today.