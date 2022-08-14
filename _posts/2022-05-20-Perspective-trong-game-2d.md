---
layout:                     post
title:                      Perspective trong game 2d
date:                       2022-05-20
mathjax:                    true
comments:                   true
description:                Trong hội họa có 1 khái niệm là phối cảnh. Nó cho ta cảm nhận được vị trí của vật thể trong không gian 3 chiều. Bởi lẽ hầu hết không gian ta muốn thể hiện là không gian 3d, nhưng lại chỉ làm việc trên màn hình 2d. Chúng ta sẽ tìm hiểu về Perspective trong 1 số game 2d.
img:                        assets/img/choosing-gpu/overview.png
---

Trong hội họa có 1 khái niệm là phối cảnh. Nó cho ta cảm nhận được vị trí của vật thể trong không gian 3 chiều. Bởi lẽ hầu hết không gian ta muốn thể hiện là không gian 3d, nhưng lại chỉ làm việc trên màn hình 2d. Chúng ta sẽ tìm hiểu về Perspective trong 1 số game 2d.

# Tổng quan về các loại góc nhìn trong game

Đây là map cho các loại camera view trong video game

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b6bf4fb1-dc7b-4de6-a6bc-ddf30ddb9e29/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b6bf4fb1-dc7b-4de6-a6bc-ddf30ddb9e29/Untitled.png)

Curlinear là 1 loại mang cảm giác kỳ dị, chúng ta biết chứ không đụng vào.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3197d63a-0fb5-4348-9d2b-d31039dd9a7e/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3197d63a-0fb5-4348-9d2b-d31039dd9a7e/Untitled.png)

Parallel là dạng khá thích hợp cho 2d game, bởi lẽ khác với perspective, các object sẽ giữ nguyên size khi thay đổi vị trí. Việc thay đổi size khá phức tạp, đặc biệt với pixel art thì việc thay đổi size hầu như là không làm được (0.9x chẳng hạn).

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/265cd02c-0f5e-4f51-94c4-9aaadf486c6b/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/265cd02c-0f5e-4f51-94c4-9aaadf486c6b/Untitled.png)

Dễ dàng nhận thấy trong hình bên phải, nếu ta cho 1 nhân vật đi trên con đường thì ta cần resize lại theo nó.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/af9cf063-1db4-4bea-bb8f-dec77e12458b/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/af9cf063-1db4-4bea-bb8f-dec77e12458b/Untitled.png)

# Parallel perspective

Về cơ bản thì Parallel perspective có 3 loại game perspective chính:

- top-down

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3df81344-aaf5-4e67-8497-ee57f7fa5628/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3df81344-aaf5-4e67-8497-ee57f7fa5628/Untitled.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c3f2e6f1-0c8c-4332-87bb-beca449ea71b/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c3f2e6f1-0c8c-4332-87bb-beca449ea71b/Untitled.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/da70941d-d5e4-4cc5-ae85-fadc0a181143/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/da70941d-d5e4-4cc5-ae85-fadc0a181143/Untitled.png)

- side-on
- isometric

Thông thường, các game 2d hiện nay đều dùng Orthographic Projection. Với cách projection này, vật thể sẽ giữ nguyên size dù cho vị trí của z-axis trong hệ tọa độ là bao nhiêu đi nữa.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e39ea1cf-7120-494f-8234-4e50d9c5d7bf/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e39ea1cf-7120-494f-8234-4e50d9c5d7bf/Untitled.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/db00aff2-22e4-4312-abbb-5eba50722be5/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/db00aff2-22e4-4312-abbb-5eba50722be5/Untitled.png)

Vậy, chúng ta sẽ tạo ra cảm nhận 3d cho người chơi như thế nào?

## Bằng composition

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1669c78b-2639-4735-9142-01b9aa97dca0/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1669c78b-2639-4735-9142-01b9aa97dca0/Untitled.png)

Chúng ta có thể tạo ra hiệu ứng vật thể này che khuất vật thể kia, như vậy sẽ có cảm giác 3d cho vật này ở trước/sau vật thể kia.

![https://miro.medium.com/max/3072/1*EuxDmqadIlIBSaNJe29w1Q.gif](https://miro.medium.com/max/3072/1*EuxDmqadIlIBSaNJe29w1Q.gif)

## Bằng hiệu ứng giảm saturation

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/920882df-0742-465c-96a8-2ac313cd2408/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/920882df-0742-465c-96a8-2ac313cd2408/Untitled.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5feb9ca5-1440-4ae6-a48b-84f87395dcad/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5feb9ca5-1440-4ae6-a48b-84f87395dcad/Untitled.png)

Ở gần thì dùng các màu có saturation cao hơn, ở xa thì giảm độ saturation xuống là 1 cách đơn giản và hiệu quả.

## Hiệu ứng Parallax scrolling

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a1d1aa82-9879-4f73-aed9-63a4a2a9abc4/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a1d1aa82-9879-4f73-aed9-63a4a2a9abc4/Untitled.png)

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