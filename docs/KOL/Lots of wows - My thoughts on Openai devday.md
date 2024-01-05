OpenAI vừa có first developer conference đầu tiên, OpenAI devday ([OpenAI DevDay](https://devday.openai.com/)). Đây là 1 buổi giới thiệu ngắn, rất on points, chỉ 45' (bạn cso thể xem video ở đây: https://www.youtube.com/live/U9mJuUkhUzk?si=xugQ8lxFhf9VM6_V). Việc điểm qua các thông tin được công bố thực sự không cần thiết, bởi lẽ rất nhiều trang báo sẽ làm điều này (và có thể sẽ alf hàng loạt các tweets nữa).
Bài viết này nhằm nói về những điều bản thân ấn tượng nhất khi theo dõi, kèm theo suy nghĩ và đánh giá của cá nhân mình về nó.

Note: đây là 1 bài viết hoàn toàn chủ quan và mang ý kiến cá nhân. Ngoại trư 1 vài con số được trích dẫn, tất cả các kết luận đều hoàn toàn mang tính bộc phát và chủ quan.
## 1, GPT4 on steroid - GPT4 turbo

![[Pasted image 20231107070302.png]]

GPT4 is the most powerful LM incurrent, by far. Một số người còn gọi GPT4 là strong LM và dùng nó để đánh giá các kết quả từ các LMs khác.
Tuy nhiên, GPT4 vẫn có nhiều hạn chế. Và hôm nay, OpenAI đã công bố những cải thiện vô cùng đáng kể cho nó. GPT4 giờ đã có phiên bản GPT4-turbo, và tôi sẽ điểm qua 1 số cải thiện mà tôi chú ý:
+ context length: lên tới 128k. Sam Altman có nói rằng ngoài việc gia tăng độ dài context length, thì khả năng xử lý là "much more accurate". Có 2 điều để nói ở đây:
	+ thứ nhất 128k context length là đủ để xử lý những cuốn sách 300 trang (the great Gatsby chỉ có khoảng 50000 words, là khoảng 64k tokens).
	+ thứ 2 là ta cần 1 bench mark để kiểm chứng mức độ "much more accurate" của model như thế nào. Xử lý được context length dài là chưa đủ, quan trọng còn phải là xử lý tốt ra sao.
+ more control: có 1 điều mà tôi chưa thấy nhắc nhiều trên mạng, đó là việc xử dụng function calling trong GPT API mang lại kết quả ổn định và tốt hơn khá nhiều. Một chú ý, các LLMs khác không hề có function calling, điều này từng khiến tôi rất ngần ngại khi chuyển từ GPT sang các LLMs khác (và các LLMs khác có capibility thấp hơn, tức là 2 order of magnitude?). Ở đây, GPT4-turbo đã tiếp tục làm tốt hơn:
	+ có json mode (phần nào tương đồng với function calling?) 
	+ ta có thể gọi nhiều function calling cho 1 query. ![[Pasted image 20231107071555.png]]
	+ tuy vậy, không hề có nhắc tới việc system mesage đã ảnh hưởng nhiều tới prompt và kết quả hay chưa. Hãy nhớ rằng trước đó, trong document của mình, OpenAI có nhắc tới system message đang chưa có ảnh hưởng nhiều tới kết quả và sẽ được cải thiện trong thời gian tới. Tuy nhiên, cá nhân mình cho rằng có lẽ đã có nhiều cải thiện về mặt này.
+ train với knowledge cut off tới Apr 2023. Tốt hơn rất nhiều. Với mức độ cải tiến và model của OpenAI, tôi cho rằng knowledge cutoff trong tương lai sẽ là trong khoảng 6 tháng - 9 tháng và giảm dần tới 3 tháng.
+ GPT4-turbo đã nhận image là input. We all could use GPT4 Vision now. Đây thực sự là 1 đột phá vì với nó, ta có thể tạo ra rất nhiều ứng dụng mà chỉ với text input rất khó hoặc không thể làm được.

## 2, Dễ tiếp cận hơn rất nhiều

Giá rẻ hơn, tốc độ nhanh hơn.
GPT4-turbo được mô tả là chất lượng tốt hơn GPT4 (có lẽ cũng tương tự việc GPT3.5 là 1 bản nâng cấp về chất lượng so với GPT3). Ngoài ra, giá thành của nó cũng rẻ hơn khá nhiều:
+ 3x cost reduce cho input tokens
+ 2x cost reduce cho output tokens
-> ~ 2,75x cost reduce

![[Pasted image 20231107084037.png]]

Tốc độ của GPT4-turbo cũng được cải thiện đáng kể. Một số test cá nhân thì GPT4-turbo tăng tốc độ inference từ 3-6 lần so với GPT4.

Ngoài ra, GPT3.5 turbo và các model finetuning cũng được giảm giá tương đối.
OpenAI Text-to-speech (TTS) có chất lượng rất tốt, giá $0.015/1k character (bản HD là $0.03/1k), rẻ hơn nhiều lần so với elevenlabs (~$0.18/1K). 

Dall-E 3 có giá 0.04$/images, mức giá này rẻ hơn MJ khá nhiều (tất nhiên, các option HD thì cao hơn). Chất lượng Dall-E 3 thật sự cũng tốt hơn hẳn Dall-E 2, nếu có prompt tốt (điều này dễ dàng thực hiện với GPT4, thực ra ở chatGPT cũng có mục tạo prompt cho Dall-E 3 rồi) thì sẽ có những bức ảnh rất chất lượng, có thể so sánh với MJ. You could see a bunch of Dall-E 3 images here: [DALL·E 3 is now available in ChatGPT Plus and Enterprise (openai.com)](https://openai.com/blog/dall-e-3-is-now-available-in-chatgpt-plus-and-enterprise)

## 3, Hệ sinh thái GPTs và Assistants API

OpenAI hướng tới việc ra mắt 1 hệ sinh thái (?) các chatbot/agent được gọi là GPTs, với việc có thể dễ dàng tạo, chia sẻ, thậm chí kiếm tiền từ nó. Tuy nhiên, vấn đề monetize chưa được cung cấp thông tin chi tiết.
Sẽ không ngạc nhiên nếu trong tuần này, hàng loạt các video Youtube/tweet về việc kiếm tiền từ tạo chatbot ra đời.

Ngoài ra, Assistants API là 1 giải pháp nhằm tạo ra các agents 1 cách dễ dàng hơn.

Tuy vậy, có 1 điều cần chú ý là với GPTs và Assistants API, nó như là 1 black box bao quanh 1 black box khác (GPT API), điều này sẽ khiến bạn rất khó port các sản phẩm của mình sang những nơi khác. Tuy nhiên trong tương lai gần mình cho rằng OpenAI API vẫn rất vượt trội nên chưa cần quá quan tâm điều này.
## 4, Custom models

You can now pay from $2 to $3 million to pretrain custom gpt-n model. Điều này có thể ít được nhắc tới và chú ý, tuy nhiên các công ty hay start up, nếu có thể sử dụng số tiền này, thì có thể mang lại lợi thế cạnh tranh lớn cho họ.

Thông tin có thể xem ở đây: [Custom models (openai.com)](https://openai.com/form/custom-models)

## 5, API threads

OpenAI API giờ đã có threads, hỗ trợ stateful API. Tuy hiện tại chúng ta khá khó để thực hiện Ops dựa trên threads, nhưng nó có thể là tiền đề cho các LLM Observation tools (a quite crowded market) thực hiện việc LLM Ops đễ dàng hơn và tốt hơn.


## 6, Một số suy nghĩ khác

+ Với khả năng xử lý tốt, độ phản hồi nhanh hơn, giá rẻ hơn, việc tạo ra những sản phẩm như này ([Air](https://www.air.ai/) ) sẽ rẻ hơn, đơn giản, nhanh chóng và chất lương hơn bao giờ hết. Việc tất cả chỉ dùng các API của OpenAI cũng giảm rắc rối trong việc setup hơn.
+ ta thật sự cần có các benchmark public và cá nhân để dễ dàng (và nhanh chóng) đưa ra 1 đánh giá sơ bộ (có thể không quá chính xác) về chất lượng model, nếu không, ta sẽ rất bị động trước các model mới (được ra mắt hàng loạt chỉ trong 1 năm vừa qua).
+ Song song với việc tạo ra các benchmark cá nhân, liệu rằng có khả năng nào sẽ có các debuger cá nhân cho code mà LLMs viết ra không? Code interpreter cũng được OpenAI ra mắt rồi.
+ những start up, prodcut chỉ là 1 thin wrapper of OpenAI API bị đe dọa nghiêm trọng (âu cũng là điều bình thường).
+ openAI library ở python đã qua version 1.1, và rất nhiều code đã thay đổi format.
+ OpenAI move so fast.

-----------------------
# English Version

# A multitude of wows: My impressions from OpenAI DevDay

OpenAI has recently held its very first developer conference, OpenAI DevDay ([OpenAI DevDay](https://devday.openai.com/)). This was a succinct and highly focused presentation, lasting just 45 minutes (you can watch the video here: [https://www.youtube.com/live/U9mJuUkhUzk?si=xugQ8lxFhf9VM6_V](https://www.youtube.com/live/U9mJuUkhUzk?si=xugQ8lxFhf9VM6_V)). Reiterating the announcements made there seems redundant, as numerous media outlets will cover the news (accompanied by a possible flurry of tweets).

This article is intended to share the aspects that I found most impressive while following the event, along with my personal thoughts and assessments.

Note: This is a subjective piece containing personal opinions. Except for some quoted figures and numbers, all conclusions drawn here are impromptu and subjective.

## 1. GPT-4 on Steroids - GPT-4 Turbo

GPT-4 is currently the most powerful language model (LM), by a significant margin. Some even refer to GPT-4 as a "strong LM" and use it as a benchmark to evaluate other language models. However, GPT-4 has its limitations. Today, OpenAI announced some substantial improvements to it. GPT-4 now has a version called GPT-4 Turbo, and I will highlight some enhancements that caught my attention:

![[Pasted image 20231107070302.png]]

- Context length: up to 128k tokens. Sam Altman mentioned that in addition to increasing the context length, the processing capability is "much more accurate." There are two points to consider here:
    - First, a 128k token context length is sufficient to process books up to 300 pages (for instance, "The Great Gatsby" has about 50,000 words, approximately 64k tokens).
    - Second, we need a benchmark to test how "much more accurate" the model really is. Handling longer context is not enough; it also has to process it well. ([[2307.03172] Lost in the Middle: How Language Models Use Long Contexts (arxiv.org)](https://arxiv.org/abs/2307.03172))
- More control: An aspect that hasn't been much discussed online is the use of function calling within the GPT API, which provides more stable and significantly better results. Notably, other large language models (LLMs) do not feature function calling. This was a concern when transitioning from GPT to other LLMs (which also had lower capabilities, perhaps two orders of magnitude?). With GPT-4 Turbo, the functionality has been improved:
    - There is a json mode (somewhat akin to function calling?).
    - Multiple function calls can be made for a single query. ![[Pasted image 20231107071555.png]]
    - However, there was no mention of whether system messages have significantly impacted prompts and results. Recall that in its documentation, OpenAI mentioned that system messages had not greatly influenced the results and that this would be improved over time. Personally, I believe there have likely been significant enhancements in this area.
- Trained with a knowledge cutoff up to April 2023. This is a substantial improvement. With OpenAI's level of enhancements and model developments, I anticipate that the knowledge cutoff will eventually be within a 6 to 9-month timeframe, eventually reducing to around 3 months.
- GPT-4 Turbo now accepts images as input. We can all now utilize GPT-4 Vision. This truly is a breakthrough because with it, we can create numerous applications that would be difficult or impossible with text input alone.
## 2. Much More Accessible

Cheaper and faster. GPT-4 Turbo is described as better in quality than GPT-4 (possibly similar to how GPT-3.5 was an upgrade in quality compared to GPT-3). Additionally, its cost is also significantly lower:

- 3x cost reduction for input tokens
- 2x cost reduction for output tokens -> ~2.75x overall cost reduction 

![[Pasted image 20231107084037.png]]

The speed of GPT-4 Turbo has also been significantly improved. Some personal tests have shown that GPT-4 Turbo has an inference speed 3-6 times faster than GPT-4.

Furthermore, GPT-3.5 Turbo and various fine-tuned models have also seen price reductions. OpenAI Text-to-Speech (TTS) is of very high quality, priced at $0.015 per 1,000 characters (HD version is $0.03 per 1,000), which is many times cheaper than ElevenLabs (~$0.18 per 1K).

Dall-E 3 is priced at $0.04 per image, which is considerably cheaper than MJ (of course, HD options are more expensive). The quality of Dall-E 3 is also significantly better than Dall-E 2, and with a good prompt (which is easily done with GPT-4, in fact, ChatGPT already has a feature to create prompts for Dall-E 3), it can produce very high-quality images, comparable to MJ. You can see a bunch of Dall-E 3 images here: [DALL·E 3 is now available in ChatGPT Plus and Enterprise (openai.com)](https://openai.com/blog/dall-e-3-is-now-available-in-chatgpt-plus-and-enterprise)

## 3. The GPT Ecosystem and Assistants API

OpenAI aims to launch an ecosystem (?) of chatbots/agents called GPTs, with the ability to easily create, share, and even monetize them. However, details on monetization have not been provided yet. It would not be surprising if this week, a wave of YouTube videos/tweets on making money from creating chatbots emerged.

Additionally, the Assistants API is a solution for creating agents more easily.

However, one thing to note is that with GPTs and the Assistants API, it's like a black box within another black box (the GPT API), which will make it very difficult to port your products to other places. However, in the near future, I believe the OpenAI API will still be far superior, so this issue may not need to be a major concern yet.

## 4. Custom Models

You can now pay from $2 to $3 million to pre-train custom GPT-n models. This might receive less mention and attention, but for companies or startups, if they can afford this amount, it could provide them with a significant competitive edge.

You can find information here: [Custom models (openai.com)](https://openai.com/form/custom-models)

## 5. API Threads

The OpenAI API now features threads, supporting a stateful API. Although it's currently challenging to perform operations based on threads, it could lay the groundwork for Large Language Model (LLM) Observation tools (a quite crowded market) to make LLM Operations easier and more efficient.

## 6. Some Other Thoughts

- With improved processing capabilities, faster response times, and lower costs, creating products like [Air](https://www.air.ai/) will be cheaper, simpler, faster, and of better quality than ever before. The sole use of OpenAI's APIs also reduces complications in setup.
- There is a real need for public and individual benchmarks to easily (and quickly) make a preliminary (though perhaps not overly accurate) assessment of model quality; otherwise, we will be very reactive to new models (which have been launched en masse in the past year).
- Alongside creating individual benchmarks, might there be the potential for personal debuggers for code written by LLMs? Code interpreters have already been launched by OpenAI.
- Startups and products that are just a thin wrapper around the OpenAI API are under serious threat (which is to be expected).
- The OpenAI library in Python has passed version 1.1, and a lot of code has changed format.
- OpenAI moves so fast. It is still the number one choice for creating LLM-related applications, by far (in my opinion).
- It is short and on point, you should watch it.