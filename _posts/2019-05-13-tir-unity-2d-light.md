---
layout:         post
title:          TIR - Today I read - Unity 2d light
date:           2019-05-13
mathjax:        true
comments:       true
description:    Nói về một số phương pháp chế tạo 2d light.
img:            assets/img/tir/2d_light.jpeg
author:         Tulip
---

Mình đang cần code một quả bóng tỏa sáng màu xanh trong game Go down mình làm, do đây là game 2d nên mình cần tìm 1 cách phù hợp để làm 2d light. Mình google được 1 số cách (có thể chưa thật đầy đủ):

# 1, Giả 2D, nhưng thực chất là 3D

Nhìn ảnh này nè

<p align="center">
  <img src="../assets/img/tir/psudo_2d.jpeg"><br>
  <i>Hình minh họa</i>
</p>

# 2, Tạo 1 layer khi ánh sáng chiếu vào

Cái này là tạo 1 layer màu trắng, kiểu khi vật được chiếu vào ấy. Sau đó khi mình render thì tùy vào xa gần mà mình sẽ activate bao nhiêu ở cái layer màu trắng kia, layer màu trắng thì sẽ set transperent rồi.

# 3, Các light cố định ở màn hình

Thì thực ra nó là các sprtie, được xếp lớp order cẩn thận thôi. Như này nè:

<p align="center">
  <img src="../assets/img/tir/psudo_light_sprite.png"><br>
  <i>Hình minh họa</i>
</p>

