---
layout:                     post
title:                      Truly multimodal
date:                       2025-03-26
mathjax:                    true
comments:                   true
description:                GPT4o image generation chính thức xuất hiện sau gần 1 năm giới thiệu, với những khả năng đáng kinh ngạc của 1 multimodal đích thực. Làm cách nào GPT4o có thể làm được điều này?
---

I. Giới thiệu
Khởi đầu:

GPT-4o khi ra mắt khiến giới công nghệ ngạc nhiên bởi khả năng không chỉ hiểu mà còn trực tiếp tạo ra hình ảnh và audio chất lượng cao, đánh dấu bước chuyển quan trọng từ việc đơn giản ghép nối các công nghệ bên ngoài thành mô hình tích hợp hoàn toàn.
Cột mốc quan trọng chứng tỏ sự phát triển tất yếu của AI: Gemini và Grok (các mô hình nổi bật từ các công ty khác như Google và xAI của Elon Musk) cũng đã nắm bắt xu hướng này.
Điểm mấu chốt:

OpenAI, mặc dù thường không tiết lộ chi tiết kỹ thuật cụ thể, lần này lại đưa ra một thông tin rất thú vị trong tài liệu công bố GPT-4o ("GPT-4o System Card – March 25, 2025"):
“Khác với DALL-E sử dụng mô hình khuếch tán (diffusion model), khả năng tạo hình ảnh của GPT-4o xuất phát trực tiếp và bản địa từ một mô hình autoregressive transformer duy nhất.”

Ý nghĩa bước ngoặt:

Việc OpenAI giải thích rõ thay đổi quan trọng về kiến trúc này (từ diffusion sang autoregressive integrative) là dấu hiệu quan trọng đáng chú ý, mở ra hướng đi mới cho sự phát triển của AI đa phương thức.
II. Một transformer autoregressive khổng lồ
(Giải thích ngắn về cách thức mô hình autoregressive tạo ra đồng thời text, ảnh và âm thanh):
Về cơ bản, mô hình autoregressive transformer hoạt động theo nguyên lý dự đoán token tiếp theo dựa trên các token đã có trước đó:

Token hoá mọi dữ liệu thành các đơn vị rời rạc: ví dụ text có token riêng, hình ảnh có token riêng, audio có token riêng.
Transformer xử lý tuần tự các token này, không phân biệt loại dữ liệu; học được ngữ cảnh rộng lớn từ sự tương quan giữa các dạng thông tin này.
Quy trình đơn giản hình dung là:

token đầu vào → transformer autoregressive → token đầu ra (text/hình ảnh/audio)
token đầu ra → được decode trở lại dạng mong muốn (âm thanh hoặc pixel ảnh)
III. Một số đặc điểm và cách GPT-4o xử lý các thách thức
1. Ưu điểm của việc chuyển đổi và tích hợp modality vào một transformer duy nhất:
Tạo ảnh với kiến thức rộng lớn tích hợp (world knowledge):

Transformer đã học được lượng kiến thức khổng lồ trong quá trình huấn luyện bằng văn bản trước đây, nay được khai thác để tạo ra hình ảnh giàu ngữ cảnh hơn.
Khả năng hiển thị, kết hợp text trong ảnh (next-level text rendering):

Lợi thế rõ ràng của autoregressive transformer: dễ dàng và chính xác hơn trong việc nhúng thông tin (text) vào hình ảnh tạo ra, điều rất khó đạt chất lượng cao bằng diffusion model trước đây (như DALL-E).
Khả năng in-context learning bản địa (native in-context learning):

Transformer có khả năng "in-context learning" vốn nổi tiếng với text, nay được áp dụng trực tiếp cho ảnh và audio, giúp model hiểu task nhanh chóng bằng ví dụ tại chỗ (prompt example → output ngay).
Công nghệ huấn luyện, tối ưu hóa thống nhất (unified post-training stack):

Quy trình tối ưu hậu huấn luyện trở nên đơn giản và hiệu quả, không cần phối hợp riêng biệt giữa nhiều mô hình khác nhau.
2. Thách thức xuất hiện tự nhiên khi sử dụng một mô hình transformer duy nhất cho tất cả các dạng thông tin:
Bit-rate khác nhau lớn giữa các loại hình data (varying bit-rates across modalities):

Text: token đặc trưng bởi vocab lớn (~50.000 tokens → 16 bit/token).
Images: token hình ảnh thường có vocab nhỏ hơn (~8192 tokens → 13 bit/token), mỗi token encode lượng lớn thông tin thị giác, độ chi tiết bị mất đáng kể so với pixel nguyên thuỷ.
Tốn kém tính toán, chưa tối ưu (compute not adaptive):

Transformer model autoregressive ban đầu không tối ưu tốt cho data dạng "nặng" (hình ảnh, audio): có thể dẫn tới quá tải tính toán, giảm hiệu quả và tăng độ trễ tính toán khi output hình ảnh lớn hoặc độ phân giải cao.
3. Phương án OpenAI áp dụng để giải quyết thách thức:
Sử dụng biểu diễn nén (compressed representations):

Thay vì directly output pixel, transformer output các token mang lượng thông tin nén cô đọng, hiệu quả tính toán và thông tin cao hơn.
Phối hợp giữa transformer autoregressive và powerful decoder (mô hình giải mã mạnh hơn, diffusion decoder):

Quy trình 2 bước để hiệu quả hóa:
Tokens → [Transformer autoregressive] → Tokens nén → [Diffusion model decoder] → Pixels, âm thanh chi tiết
Điều này giúp cân bằng giữa lượng thông tin và chi phí tính toán, vừa hợp lý về computational cost, vừa đạt chất lượng output tốt.
IV. Tổng kết và ý nghĩa sau cùng (cần thêm vào đây)
Bạn có thể nhấn mạnh một vài điểm mang tính suy rộng hoặc hướng tới tương lai như:

Tại sao việc chuyển đổi này lại thú vị và đáng kỳ vọng?

Đánh dấu bước ngoặt mới cho sự phát triển các AI thế hệ tiếp theo.
Có thể dẫn đến các ứng dụng toàn diện sáng tạo hơn, như các trợ lý cá nhân AI thật sự đa phương tiện.
Thách thức còn lại:

Tính toán lớn, tốn kém vẫn là vấn đề trong tương lai. Các công ty sẽ cần tìm cách tối ưu hoá sâu hơn.
Vấn đề interpretability, explainability khi transformer làm mọi việc từ A tới Z.
Triển vọng tương lai, bình luận cá nhân:

Hy vọng OpenAI tiếp tục công bố thêm chi tiết kỹ thuật, mở ra hướng nghiên cứu mới cho cộng đồng.
Công nghệ này có thể thúc đẩy hệ sinh thái sáng tạo mạnh mẽ—từ giải trí, giáo dục, tới trợ lý thông minh thực sự đa năng.
Bài viết theo hướng rõ ràng như thế này sẽ giúp độc giả dễ dàng theo sát tư duy logic, dễ hiểu hơn về mặt khoa học công nghệ, cũng như nắm bắt được triển vọng thực tế mà công nghệ mới mang lại.

II. Một transformer autoregressive khổng lồ
(Giải thích ngắn về cách thức mô hình autoregressive tạo ra đồng thời text, ảnh và âm thanh):
Về cơ bản, mô hình autoregressive transformer hoạt động theo nguyên lý dự đoán token tiếp theo dựa trên các token đã có trước đó:
Token hoá mọi dữ liệu thành các đơn vị rời rạc: ví dụ text có token riêng, hình ảnh có token riêng, audio có token riêng.
Transformer xử lý tuần tự các token này, không phân biệt loại dữ liệu; học được ngữ cảnh rộng lớn từ sự tương quan giữa các dạng thông tin này.
Quy trình đơn giản hình dung là:
token đầu vào → transformer autoregressive → token đầu ra (text/hình ảnh/audio) token đầu ra → được decode trở lại dạng mong muốn (âm thanh hoặc pixel ảnh)

Phần 2 nên nói về các token text/ảnh/audio tạo ra thế nào, khác nhau thế nào (ngắn gọn thôi)

Bạn có thể thêm vào phần này một đoạn giải thích ngắn gọn, hiệu quả như sau:

Vậy token cho từng dạng dữ liệu—text, ảnh và audio—được tạo ra như thế nào và có gì khác biệt?

Text tokens: Dữ liệu chữ viết được phân nhỏ thành từng token, thường là các từ hoặc các phần nhỏ hơn của từ (subword). Một token text vì thế thường khá nhỏ, nhanh, dễ xử lý và lưu trữ gọn nhẹ (vocab khoảng vài chục nghìn token).

Image tokens: vì hình ảnh vốn là dữ liệu liên tục, dung lượng lớn, nên trước khi transformer xử lý, hình ảnh được chia thành nhiều vùng nhỏ (patch nhỏ, ví dụ 8×8 hoặc 16×16 pixel). Mỗi vùng này sau đó được mã hoá (encode) thành một token, biểu diễn các đặc trưng hình ảnh một cách cô đọng để giảm lượng dữ liệu khổng lồ mà transformer phải xử lý trực tiếp.

Audio tokens: tương tự, âm thanh là dữ liệu liên tục theo thời gian, nên thường cũng được chia nhỏ thành các đoạn ngắn (vài mili giây hoặc hàng chục mili giây). Các đoạn đó sau đó được mã hoá thành những token riêng biệt, nén thông tin về cao độ (pitch), âm sắc (timbre), cường độ, giúp transformer dễ dàng xử lý.

Dù cùng được gọi chung là “token”, mỗi loại token này lại đại diện cho một kiểu dữ liệu và mức độ thông tin khác nhau, tạo ra các đặc thù riêng trong xử lý và sinh dữ liệu đầu ra của mô hình autoregressive transformer.

I think this format is a bit better:

Text Tokens
Vocabulary Size: Typically ranges from 10,000 to 100,000 tokens (e.g., GPT-3 uses ~50,000 tokens with BPE).

Bits per Token: For 50,000 tokens, log₂(50,000) ≈ 15.6 bits. So, each text token carries about 15–16 bits of information, assuming a uniform distribution (in practice, entropy is lower due to language patterns).

Information Content: Each token represents a word, subword, or symbol, packing semantic meaning into a compact, discrete unit. The bit rate reflects linguistic structure rather than raw data.

Image Tokens
Vocabulary Size: Varies depending on the tokenization method. For example:
VQ-VAE (used in DALL·E) might use 8192 tokens → log₂(8192) = 13 bits per token.

Some models use smaller vocabularies (e.g., 512 tokens → 9 bits) or larger ones (e.g., 65,536 tokens → 16 bits).

Bits per Token: For 8192 tokens, each image token carries ~13 bits. However, this token typically represents a patch of pixels (e.g., 8x8 or 16x16), not a single pixel’s worth of data.

Information Content: Image tokens encode visual features (e.g., edges, colors, textures) over a spatial region. The bit rate per token is lower than the raw pixel data it replaces, as tokenization compresses continuous information into discrete codes.

You should give some number in each (Vocab size, việc cần phải nén, continous or not,...)

Here is your revised section in a well-structured, accessible format. Feel free to adapt or expand it as needed:

Text Tokens
Vocabulary Size: Thường từ 10,000 đến 100,000 tokens. Ví dụ, GPT-3 sử dụng khoảng 50,000 tokens (theo phương pháp BPE – Byte Pair Encoding).

Bits per Token: Với 50,000 tokens, cần khoảng log₂(50,000) ≈ 15.6 bits/token. Con số thực tế thấp hơn (khoảng 8–12 bits/token) do độ dư thừa (redundancy) lớn trong ngôn ngữ tự nhiên.

Information Content: Mỗi token đại diện cho một từ, một phần nhỏ (subword), hoặc ký tự, được mã hoá dưới dạng rời rạc (discrete symbolic). Vì vậy, token văn bản đại diện cho thông tin ngữ nghĩa, ít cần nén thêm và có cấu trúc ngôn ngữ rõ ràng.

Image Tokens
Vocabulary Size: Phụ thuộc vào phương pháp mã hoá (như VQ-VAE, VQ-GAN). Ví dụ:

DALL·E sử dụng VQ-VAE có khoảng 8192 tokens (log₂(8192) ≈ 13 bits/token).
Một số mô hình khác dùng nhỏ hơn (512 tokens ~ 9 bits/token) hay lớn hơn (65,536 tokens ~ 16 bits/token).
Bits per Token: Với vocab 8,192 tokens: mỗi token khoảng 13 bits. Tuy nhiên, mỗi token này đại diện cho một vùng không gian ảnh tương đối lớn (ví dụ một cụm pixel 8×8 hoặc 16×16), không phải từng pixel riêng lẻ.

Information Content: Các Image tokens lưu các đặc điểm trực quan (màu sắc, cạnh, texture, pattern,…) ở từng vùng ảnh. Token hoá ảnh là cách thức nén mạnh dữ liệu liên tục (continous data–pixel thô) xuống các mã rời rạc (discrete codes), làm giảm lượng thông tin rõ rệt so với dữ liệu pixel nguyên gốc.

Audio Tokens
Vocabulary Size: Thay đổi tùy theo mức độ nén âm thanh. Audio thường sử dụng vocab từ khoảng vài trăm cho đến vài nghìn tokens (chẳng hạn thường thấy từ 1024 đến 8192 tokens, ~ 10–13 bits/token).

Bits per Token: Ví dụ phổ biến là vocab = 2048 tokens, thì mỗi audio token là khoảng log₂(2048) ≈ 11 bits/token.

Information Content: Audio vốn là dữ liệu liên tục theo thời gian (continous temporal). Token âm thanh đại diện cho các đoạn âm thanh ngắn (ví dụ 10–40 mili giây), chứa thông tin rời rạc về đặc điểm âm thanh như cao độ (pitch), âm sắc (timbre), cường độ âm thanh… Việc mã hoá audio như vậy giảm mạnh kích cỡ nhưng giữ đủ đặc trưng để tái tạo âm thanh.

Cấu trúc này giúp người đọc dễ dàng hình dung, so sánh ngắn gọn và rõ ràng đặc điểm kỹ thuật từng loại token mà transformer autoregressive sử dụng cho các modal khác nhau.