---
layout:                     post
title:                      Truly multimodal
date:                       2025-03-26
mathjax:                    true
comments:                   true
description:                GPT4o image generation chính thức xuất hiện sau gần 1 năm giới thiệu, với những khả năng đáng kinh ngạc của 1 multimodal đích thực. Làm cách nào GPT4o có thể làm được điều này?
---

# I. Giới thiệu

Năm ngoái, GPT-4o ra mắt, với "o" là "omni", ám chỉ việc đây là một model multimodal đích thực, không chỉ còn là việc đơn giản plug với các model khác. Những ngày vừa qua, Gemini và Grok cũng theo đó cho ra những model có khả năng output trực tiếp ra hình ảnh.

OpenAI, mặc dù thường không tiết lộ chi tiết kỹ thuật cụ thể, lần này đã đưa ra một thông tin về model trong tài liệu công bố GPT-4o ("GPT-4o System Card – March 25, 2025"):

> "Unlike DALL-E, which operates as a diffusion model, 4o image generation is an autoregressive model natively embedded within ChatGPT."

Vậy, chúng ta cùng tìm hiểu cách mà GPT-4o và các model khác thực hiện điều này.

# II. One Big Autoregressive Transformer

Về cơ bản, mô hình autoregressive transformer hoạt động theo nguyên lý dự đoán token tiếp theo dựa trên các token đã có trước đó:

- **Token hoá dữ liệu**: Ví dụ, text có token riêng, hình ảnh có token riêng, audio có token riêng.
- **Transformer xử lý tuần tự các token**: Không phân biệt loại dữ liệu; từ đó học được ngữ cảnh rộng lớn từ sự tương quan giữa các dạng thông tin này.

Quy trình đơn giản là:

- Token đầu vào → Transformer autoregressive → Token đầu ra (text/hình ảnh/audio)
- Token đầu ra → Được decode trở lại dạng mong muốn (âm thanh hoặc pixel ảnh)

# III. Đặc điểm và Cách GPT-4o Xử Lý Thách Thức

## 1. Ưu điểm:

- **Tạo ảnh với hiểu biết có sẵn từ LLM (world knowledge)**: Transformer đã học được lượng kiến thức khổng lồ trong quá trình huấn luyện, nay được khai thác để tạo ra hình ảnh giàu ngữ cảnh hơn.
- **Khả năng hiển thị, kết hợp text trong ảnh**: Dễ dàng và chính xác hơn trong việc nhúng thông tin (text) vào hình ảnh, điều rất khó đạt chất lượng cao bằng diffusion model trước đây (như DALL-E).
- **Khả năng hiểu trực tiếp từ context**: Model có khả năng hiểu và tuân thủ instruction, thậm chí các semantic instruction từ input là ảnh khác.
- **Chỉ còn 1 stack**: Thay vì phải plug với nhiều stack (GPT + agent + DALL-E...), nay chỉ thuần túy là GPT-4o input và output.

## 2. Thách thức:

- **Bit-rate khác nhau lớn giữa các loại hình data**:
  - Text: Token đặc trưng bởi vocab lớn (~50.000 tokens → 16 bit/token).
  - Images: Token hình ảnh thường có vocab nhỏ hơn (~8192 tokens → 13 bit/token), mỗi token encode lượng lớn thông tin thị giác, độ chi tiết bị mất đáng kể so với pixel nguyên thuỷ.

- **Tốn kém tính toán, chưa tối ưu (compute not adaptive)**: Transformer model autoregressive ban đầu không tối ưu tốt cho data dạng "nặng" (hình ảnh, audio) dẫn tới quá tải tính toán, giảm hiệu quả và tăng độ trễ khi output hình ảnh lớn hoặc độ phân giải cao. Với GPT-4o, ảnh có độ chi tiết và sắc nét rất cao, dẫn tới một lần gen ảnh có thể mất khoảng 30 giây, ảnh hưởng lớn tới UX.

## 3. Phương án OpenAI áp dụng để giải quyết thách thức:

- **Sử dụng các phương pháp nén (compressed representations)**: Thay vì directly output pixel, transformer output các token nén cô đọng, hiệu quả tính toán và thông tin cao hơn.
- **Phối hợp giữa transformer autoregressive và powerful decoder**: Mô hình giải mã mạnh hơn, diffusion decoder.

# IV. Tổng kết

GPT-4o thực sự đánh dấu bước ngoặt mới cho sự phát triển các AI model thế hệ tiếp theo. Truly multimodal mở ra nhiều khả năng mới cho UX, có thể dẫn đến các ứng dụng sáng tạo hơn, như các trợ lý cá nhân AI đa phương tiện.

Tính toán lớn, tốn kém vẫn là vấn đề trong tương lai. Các công ty cần tối ưu hoá sâu hơn. Tuy vậy, với computational power tiếp tục tăng nhanh, một trợ lý ảo như Samantha không còn xa vời.