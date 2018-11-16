---
layout: post
title:  TIL - Làm việc với memory trong RL
date:   2018-11-16
mathjax: true
comments: true
description: Vấn đề nên xử lý như nào với Memory khi train RL
img: til/manage_memory.png
---

# Sơ qua về câu chuyện

Mình có làm project tạo bot chơi game [Pong-v0](https://github.com/Tulip4attoo/rl/tree/master/f-class/pong-v0). Vấn đề đặt ra là mình có làm replay buffer, để agent có thể train với random memory từ trước nữa. Nhưng mà, trong paper [Human-level control through deep reinforcement learning](https://deepmind.com/research/publications/human-level-control-through-deep-reinforcement-learning/) của Deepmind (và cả cái tutorial mà mình học theo nữa), họ dùng memory size là 1 triệu. Hmm, theo tính toán, hiện tại với size 600, mình tốn 200MB RAM, tức là để đạt memory size là 1 triệu, mình cần khoảng 300GB RAM. Hmmm.

Note lại là trong bài [RL hard](https://tulip4attoo.github.io/blog/tir-rl-hard/), người ta toàn train mấy trăm triệu frames.

# Cách giải quyết

Có 2 cách giải quyết mình nghĩ tới:
+ điều chỉnh input khéo hơn:
    + giảm kích cỡ input về 40*40, cũng như điều chỉnh input cho memory khi load, cũng như có thể giảm stack xuống còn 3 --> sẽ x8 được memory size.
    + điều chỉnh type của image, cụ thể float64 --> np.float16, x4 memory size mà không cần điều chỉnh gì nhiều
+ lưu input ra máy và load. Thực ra nên nhớ là các model bt cũng đều load data từ máy lên đó thôi, vài trăm GB ảnh thì đâu có lưu trong RAM.


## Tổng kết lại

Đây là 1 vấn đề khó. Cách 1 là giải quyết tạm thời. Cách 2 là xử lý tốt cho sau này, tuy nhiên mình mới đang làm thôi. Note là cách 2 có thể view tốt được data và đảm bảo reproduce kết quả.