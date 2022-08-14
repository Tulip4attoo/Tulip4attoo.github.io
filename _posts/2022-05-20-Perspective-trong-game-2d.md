---
layout:                     post
title:                      Perspective trong game 2d
date:                       2022-05-20
mathjax:                    true
comments:                   true
description:                Trong hội họa có 1 khái niệm là phối cảnh. Nó cho ta cảm nhận được vị trí của vật thể trong không gian 3 chiều. Bởi lẽ hầu hết không gian ta muốn thể hiện là không gian 3d, nhưng lại chỉ làm việc trên màn hình 2d. Chúng ta sẽ tìm hiểu về Perspective trong 1 số game 2d.
img:                        assets/img/perspective/orthographic.png
---

Trong hội họa có 1 khái niệm là phối cảnh. Nó cho ta cảm nhận được vị trí của vật thể trong không gian 3 chiều. Bởi lẽ hầu hết không gian ta muốn thể hiện là không gian 3d, nhưng lại chỉ làm việc trên màn hình 2d. Chúng ta sẽ tìm hiểu về Perspective trong 1 số game 2d.

# Tổng quan về các loại góc nhìn trong game

Đây là map cho các loại camera view trong video game

<div align="center">
  <img src="../assets/img/perspective/overview.png" width="100%"><br>
  <i>Các loại camera view cơ bản</i>
</div>

Curlinear là 1 loại mang cảm giác kỳ dị, chúng ta biết chứ không đụng vào.

<div align="center">
  <img src="../assets/img/perspective/curlinear.png" width="100%"><br>
  <i>Curlinear</i>
</div>

Parallel là dạng khá thích hợp cho 2d game, bởi lẽ khác với perspective, các object sẽ giữ nguyên size khi thay đổi vị trí. Việc thay đổi size khá phức tạp, đặc biệt với pixel art thì việc thay đổi size hầu như là không làm được (0.9x chẳng hạn). Tuy vậy, nếu ta làm trên môi trường 3d thì việc này khá đơn giản. Tất nhiên, việc kết hợp 3d và 2d như thế nào, lại là 1 vấn đề khác.

<div align="center">
  <img src="../assets/img/perspective/parallel1.png" width="100%"><br>
  <i></i>
</div>


Dễ dàng nhận thấy trong hình, nếu ta cho 1 nhân vật đi trên con đường thì ta cần resize lại theo nó.

<div align="center">
  <img src="../assets/img/perspective/parallel2.png" width="100%"><br>
  <i></i>
</div>

# Parallel perspective

Về cơ bản thì Parallel perspective có 3 loại game perspective chính:

<div align="center">
  <img src="../assets/img/perspective/topdown.png" width="100%"><br>
  <i>Top-down</i>
</div>

<div align="center">
  <img src="../assets/img/perspective/sideon.png" width="100%"><br>
  <i>Side-on</i>
</div>

<div align="center">
  <img src="../assets/img/perspective/isometric.png" width="100%"><br>
  <i>Isometric</i>
</div>


Thông thường, các game 2d hiện nay đều dùng Orthographic Projection. Với cách projection này, vật thể sẽ giữ nguyên size dù cho vị trí của z-axis trong hệ tọa độ là bao nhiêu đi nữa.

<div align="center">
  <img src="../assets/img/perspective/orthographic.png" width="100%"><br>
  <i>Orthographic Projection</i>
</div>

<div align="center">
  <img src="../assets/img/perspective/diffirent-lens.png" width="100%"><br>
  <i>With different lens</i>
</div>


Vậy, chúng ta sẽ tạo ra cảm nhận 3d cho người chơi như thế nào?

## Bằng composition

<div align="center">
  <img src="../assets/img/perspective/composition1.png" width="100%"><br>
  <i>Dùng composition để tạo hiệu ứng xa-gần</i>
</div>

Chúng ta có thể tạo ra hiệu ứng vật thể này che khuất vật thể kia, như vậy sẽ có cảm giác 3d cho vật này ở trước/sau vật thể kia.

<div align="center">
  <img src="../assets/img/perspective/composition2.gif" width="100%"><br>
  <i>Lập các layer depth khác nhau để có thể che khuất nhau</i>
</div>


## Bằng hiệu ứng giảm saturation

<div align="center">
  <img src="../assets/img/perspective/saturation1.png" width="100%"><br>
  <i></i>
</div>

<div align="center">
  <img src="../assets/img/perspective/saturation2.png" width="100%"><br>
  <i></i>
</div>

Ở gần thì dùng các màu có saturation cao hơn, ở xa thì giảm độ saturation xuống là 1 cách đơn giản và hiệu quả.

## Hiệu ứng Parallax scrolling

<div align="center">
  <img src="../assets/img/perspective/parallax.png" width="100%"><br>
  <i></i>
</div>

Hiệu ứng này kết hợp zoom in/zoom out khá là tốt. Ví dụ như này: 

{% include youtubePlayer.html id="ptdweDDyB8o" %}

# Tổng kết

Bài này cũng ngắn và mang mục đích giới thiệu thôi. Sẽ có 1 phân tích cách các game 2d thể hiện đồ họa của họ như thế nào, để học tập. Cheer!

# Tham khảo

[https://docs.unity3d.com/2021.2/Documentation/Manual/Quickstart2DPerspective.html](https://docs.unity3d.com/2021.2/Documentation/Manual/Quickstart2DPerspective.html)

[https://opengameart.org/content/chapter-3-perspectives](https://opengameart.org/content/chapter-3-perspectives)

[https://gamasutra.com/blogs/MichalBerlinger/20160323/268657/Combining_Perspective_and_Orthographic_Camera_for_Parallax_Effect_in_2D_Game.php](https://gamasutra.com/blogs/MichalBerlinger/20160323/268657/Combining_Perspective_and_Orthographic_Camera_for_Parallax_Effect_in_2D_Game.php)

[https://medium.com/retronator-magazine/game-developers-guide-to-graphical-projections-with-video-game-examples-part-2-multiview-8e9ad7d9e32f](https://medium.com/retronator-magazine/game-developers-guide-to-graphical-projections-with-video-game-examples-part-2-multiview-8e9ad7d9e32f)

[https://medium.com/retronator-magazine/game-developers-guide-to-graphical-projections-with-video-game-examples-part-1-introduction-aa3d051c137d](https://medium.com/retronator-magazine/game-developers-guide-to-graphical-projections-with-video-game-examples-part-1-introduction-aa3d051c137d)