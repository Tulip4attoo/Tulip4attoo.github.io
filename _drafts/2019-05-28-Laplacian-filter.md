---
layout:         post
title:          Làm quen với OpenAI gym thông qua game Taxi-v2
date:           2019-04-25
mathjax:        true
comments:       true
description:    Giới thiệu về Laplacian filter, giải thích vì sao 1 số filter lại là Laplacian filter.
img:            assets/img/laplacian-filter/taxi-v2.gif
author:         Tulip
---

# Toán tử Laplace

Trước hết, ta hãy nói về toán tử Laplace. Được ký hiệu $\$\bigtriangleup$$ hoặc $\bigtriangledown ^2$, toán tử Laplace là phép toán cho giá trị scalar, tương ứng với dot product của 2 gradient vector.

$\bigtriangleup$ = \bigtriangledown . \bigtriangledown = \bigtriangledown ^2 = $

Với N = 2, tương ứng với không gian bậc 2, ta có:

$\bigtriangleup$ = $

# Laplace filter

Laplace filter là lớp filter cho ảnh 2D. Ảnh 2D có đặc tính là ta có thể tính toán đạo hàm bậc 1 hoặc bậc 2 để thực hiện edge detection.

# Tham khảo

1, http://fourier.eng.hmc.edu/e161/lectures/gradient/node7.html