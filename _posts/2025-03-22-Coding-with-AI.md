---
layout:                     post
title:                      Coding with AI - Dùng sao cho tốt?
date:                       2025-03-22
mathjax:                    true
comments:                   true
description:                Hiện nay, coding with AI tiếp tục thay đổi cách chúng ta viết code và giải quyết vấn đề. Bài viết này chú trọng vào HOW - chúng ta nên sử dụng AI trong coding thế nào để đạt hiệu quả tốt hơn.
---

Lập trình ra đời từ nửa sau thế kỷ 20 và đã trải qua nhiều thay đổi lớn. Ban đầu, lập trình viên dùng thẻ đục lỗ, với chi phí debug cực cao do mỗi lỗi phải sửa thủ công trên từng tấm thẻ. Sau đó, ngôn ngữ Assembly và các ngôn ngữ cấp cao như Fortran xuất hiện, máy tính nhanh hơn, giảm dần chi phí debug bằng cách thay thế mã máy phức tạp. Đến khi màn hình và giao diện người dùng (UX) ra đời, việc viết và sửa mã trở nên trực quan hơn. Các chu kỳ phát triển (iteration) cũng ngắn lại đáng kể, đi kèm với những cơ chế quản lý mới như Agile hay DevOps. 

Hiện nay, chúng ta chứng kiến 1 thay đổi lớn nữa: coding with AI, tiếp tục thay đổi cách chúng ta viết code và giải quyết vấn đề.

Bài viết này chú trọng vào HOW: chúng ta nên sử dụng AI trong coding thế nào để đạt hiệu quả tốt hơn.

# 1, Current Use Cases of AI in Coding  

Theo dõi qua các kênh như X, có thể tạm chia ra cách mọi người sử dụng AI cho coding thành 2 hướng chính:
+ từ idea -> MVP: Các công cụ như v0 và Lovable cho phép xây dựng sản phẩm khả thi tối thiểu (MVP) nhanh chóng, đặc biệt cho dự án web. Điều này giúp tạo MVP trong một cuối tuần là điều hoàn toàn khả thi, đặc biệt cho các dự án không quá phức tạp về kỹ thuật. Điều này sẽ thay đổi về cơ bản cách mọi người, đặc biệt là cá nhân làm MVP.
+ áp dụng cho daily development: Với lập trình viên thông thường, AI được tích hợp vào các IDE hỗ trợ việc code hàng ngày. Từ việc dùng completion và gợi ý, cho tới refactor và clean code trở nên nhanh gọn hơn, và việc tạo test dồng thời là document cũng trở thành những công việc nhẹ nhàng hơn rất nhiều.

# 2, Key Characteristics of AI in Coding

## Key Features and Considerations
+ các công cụ rất khác biệt: không như trước đây, các IDE về cơ bản là giống nhau, các công cụ có những features rất khác biệt và khó để chuyển đổi hơn. Ngay ở trên, ta có thể thấy sự khác biệt giữa các IDE và bộ công cụ chuyên biệt cho làm web. Chưa kể tới, các công cụ có sự hỗ trọ về AI-agent, mang tới sự khác biệt về flow test/debug/implement.
+ Giảm chi phí viết code (code writing): chi phí cho code writing giảm đáng kể, dẫn tới tầm quan trọng của code reading tăng lên nhiều. Làm cách nào để đọc và hiểu code nhanh hơn trở thành 1 vấn đề thiết thực và mang tính quan trọng cao hơn (làm cách nào AI giúp ta được điều này?). Ngoài ra, việc tuyển dụng có thể sẽ thay đổi, giảm sự chú trọng vào code writing (leetcode), thay vào đó là AI và code reading (như cách chúng ta làm việc hàng ngày)
+ Con người vẫn phải giải quyết và hoàn thiện: có thể coi việc hoàn thành dự án thì AI có thể hoàn thành 70-80% cực kỳ nhanh, tuy nhiên 20% còn lại sẽ cực kỳ khoscho AI hoàn thiện, thường khi đạt tới 1 mức độ - về độ dài và độ phức tạp, AI sẽ gần như không tiến thêm nữa trong việc hoàn thành project. Khi đó, các lập trình viên nên thật sự nhúng tay vào giải quyết vấn đề.

# 3, Practical Patterns and Strategies

Để tận dụng tốt lợi ích của AI trong coding, cá nhân tôi sử dụng 1 số pratical pattern sau:
+ AI first draft: để AI đưa ra các giải pháp ban đầu. Nó có thể không tốt, nhưng giúp ta có cái nhìn ban đầu về dự án.
+ stay modular: đây là điều quan trọng bậc nhất. Giữ cho code của bạn có tính module cao, giúp dễ dàng thay thế hoặc cải thiện các thành phần được tạo ra bởi AI nếu cần. CÓ nhiều lý do khiến nó trở nên quan trọng:
    + AI hiện tại vẫn rất dễ rối khi thay đổi nhiều thứ. Việc giữ code theo modular giúp AI chỉ cần sửa những thành phần sai, giữ lại thành phần đúng 1 cách dễ hơn.
+ Restart When Needed: Nếu nhận thấy AI không thể giải quyết hiệu quả một tính năng hoặc đoạn code cụ thể, đừng ngần ngại bắt đầu lại từ đầu (trước khi làm feature). AI rất dễ bị stuck in a loop.
+ Each chat for each task: mỗi chat chỉ nên dùng cho 1 task. Hãy giữ cho context được focus và nhỏ gọn, bởi dù được tăng context size lên nhưng các model khi làm với context dài vẫn không quá hiệu quả. Liên tục review và feedback trong chat, tốt nhất nên xử lý xong task trước khi làm task khác.
+ Trust but verify: thường xuyên check và test lại code. Ngoài ra với AI, việc gen test case trở nên dễ dàng và nhanh chóng hơn rất nhiều. hú ý trao đổi và nghĩ về edge case (thật ra cũng như code bt thôi).
+ start small: đây là cách chúng ta dễ kiểm soát hơn, tránh việc code bị tràn lan sau này.
+ hiểu rõ các model: mỗi model có những đặc điểm khác biệt nhất định trong việc gen code. Việc nắm được khả năng của các model giúp ta có thể chọn model phù hợp hơn (nhưng cũng tùy tool, vd dùng cursor thì thường 3.7 sonnet là được rồi, nhưng vd cline sẽ khác. Sau mà dùng model để chọn LLM route thì còn khác nữa). Việc hiểu rõ model còn giúp ta biết được các feature nào có thể để code gen từ đầu tới cuối, các feature nào thì để code gen 1 đoạn và ta hướng dẫn 1 đoạn (vd theo kinh nghiệm cá nhân, LLM rất mạnh trong web và python). Tất nhiên việc "hiểu rõ" này mang tính thiên kiến cá nhân, nhưng có thể mang lại lợi ích lớn cho ta, chí ít, tốc độ sau cùng thường không chậm hơn tốc độ viết code từ đầu tới cuối, mà thường là nhanh hơn đáng kể.


# 4, Future of AI in Coding

+ Một trend được push mạnh hiện nay là AI Agent (và computer use). Rất rõ ràng, khi áp dụng 2 điều này thì việc run và test trở nên nhanh hơn và thuận tiện hơn rất nhiều. Các phản hồi cũng rõ ràng và cụ thể hơn (vì visual understanding)
+ Các best practice và sự thông thạo khi sử dụng AI sẽ tăng lên. Đồng thời là các model sẽ càng phản hồi tốt hơn và rẻ hơn -> càng dùng nhiều hơn.

# Conclusion

Vậy ta làm thế nào? Dùng hàng ngày, thi thoảng lên mạng check xem có cách dùng nào mới không, có tip & trick nào không (vd cursor rules thì có cả 1 site cung cấp cho ta), cái gì thành quy luật thì càng tốt để dùng.
