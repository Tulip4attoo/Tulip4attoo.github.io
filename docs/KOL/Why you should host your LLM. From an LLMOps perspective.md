
I recently read an article on the topic, advocating for self-hosting of LLM: [http://marble.onl/posts/why_host_your_own_llm.html](http://marble.onl/posts/why_host_your_own_llm.html). Drawing from my personal experience with a project involving LLM, I'm writing this post to further discuss reasons why you should seriously consider hosting your own LLM from an LLMOps perspective.

In today's landscape, utilizing LLM often implies relying on APIs provided by companies like OpenAI/Anthropic. The process is straightforward: you create a prompt and receive the generated output.

If you're using LLM for prototyping or toy projects, using these APIs is undoubtedly the optimal choice. They offer economic benefits and rapid deployment while delivering high-quality results. Especially with GPT-4 being the pinnacle of current models.

However, if your use of LLM goes beyond a mere front-end interface, and you're creating products that leverage LLM extensively, you should seriously contemplate self-hosting your own LLM. Beyond the well-discussed reasons such as data ownership, the reasons for hosting your own LLM from an operational perspective include:

1. You're entirely reliant on OpenAI, and unfortunately, OpenAI's support is almost non-existent.
2. GPT models exhibit substantial non-deterministic behavior.
3. Concerns about political correctness and censorship.
4. Managing version control becomes significantly more challenging.
5. Is having the model at this cost truly necessary?

These considerations highlight the importance of evaluating the trade-offs between convenience and control when deciding to host your own LLM. Your unique project requirements and long-term goals should drive this decision-making process.

# 1, You're entirely reliant on OpenAI and heck, OpenAI support is non-existent

It's obvious that you rely completely on OpenAI when utilizing their solutions. However, the OpenAI API isn't truly stable, and even more concerning, there is almost no support available for customers, especially for smaller ones. Essentially, you have no means of contacting OpenAI's support team. Imagine if OpenAI experiences an issue and you can't access their API on your product launch day – that would be a disaster.

Using OpenAI's ticket system, I received only a single response after over 2 months. This is a significant drawback.

Not to mention major issues like server downtime, the frequency of API problems is also quite high. With the rapid development, OpenAI's infrastructure hasn't matured sufficiently.

# 2, GPT models are wildly non-deterministic

This is an issue that's far from being new. According to this article [https://152334h.github.io/blog/non-determinism-in-gpt-4/](https://152334h.github.io/blog/non-determinism-in-gpt-4/), the level of random responses (even with temperature set to 0) falls within the range of 10-35%, a significant margin.

![[Pasted image 20230817153819.png]]

This becomes even more concerning when models transition between versions. The scenario where a prompt works smoothly in one version but encounters errors in the next version is a challenge I've had to face.

Deterministic models undoubtedly offer easier operational management. Models like Llama2 7b and 13b, based on personal examination, are entirely deterministic.

# 3, Political correctness and censorship

Recently, a new game called Baldur's Gate 3 has become one of the most successful launches on Steam. What intrigued me and fellow gamers is the game's inclusion of edgy details, even incorporating explicit content. These distinct indie characteristics have played a small part in garnering player favor.

If you aim to create products with a unique signature, or even explore themes intended for mature audiences, it's advisable to explore building your own LLMs for such purposes.

# 4, Version control will be much more painful

OpenAI will continually release new model versions and eventually cease support for older versions. Given that a model version can only be used for 6 months, which is rather limited, it necessitates a constant team effort to monitor the behavior of these models. If you're merely utilizing LLMs for standard question-and-answer tasks, this might not impact you significantly. However, if you're crafting a custom agent to address specific tasks (like generating queries), it will demand additional resources that might not be worth the investment.

# 5, Do you really need a model at this cost?

If you intend to host a model that can compete with GPT 3.5, it's likely that you'll need to use Llama2-70b, and in that case, there's almost no cost advantage for inference [3].

However, do you truly require such a large model? It heavily depends on the problem you aim to solve. There are indeed smaller models that might suit your needs.

![[Pasted image 20230818111855.png]]

Recently, Stability introduced an LLM for code, containing just 3 billion parameters[4]. Similarly, Replit has their replit-code model, also with 3 billion parameters. These models can be trained and used for inference with significantly lower VRAM requirements. Consequently, the cost of inference drops by orders of magnitude, allowing you the leeway to implement a broader range of monetization plans.

# Final thought

I still believe that it's still best to start prototyping and even create an MVP using APIs from OpenAI or Anthropic. Nevertheless, you can also consider self-hosting LLMs to establish a "moat" for your product. This approach can also deepen your understanding of the technology, helping you adapt in this rapidly evolving field.

# References

[1] http://marble.onl/posts/why_host_your_own_llm.html
[2] https://152334h.github.io/blog/non-determinism-in-gpt-4/
[3] https://www.cursor.so/blog/llama-inference
[4] https://stability.ai/blog/stablecode-llm-generative-ai-coding

-----------

Tôi mới đọc 1 bài viết về chủ đề, cổ vũ cho việc tự host LLM: http://marble.onl/posts/why_host_your_own_llm.html. Với kinh nghiệm cá nhân thông qua việc triển khai 1 dự án có sử dụng LLM, tôi viết bài này để nói thêm 1 số lý do bạn nên nghiêm túc cân nhắc tới đề host your own LLM, ở LLMOps view.

Thời buổi hiện nay, sử dụng LLM thường mang kèm ý nghĩa chúng ta sẽ call các API từ những nhà cung cấp như OpenAI/Anthropic. Việc sử dụng đơn giản là bạn sẽ tạo ra 1 prompt, sau đó nhận kết quả trả về.

Nếu bạn sử dụng LLM để làm prototype hoặc các toy project, thì việc sử dụng các API rõ ràng là lựa chọn tối ưu nhất. Những API này mang lại lợi ích về mặt kinh tế và thời gian deploy, ngoài ra các API này mang chất lượng rất cao, đặc biệt GPT-4 vẫn là model đỉnh nhất thời gian hiện tại.

Tuy nhiên, nếu bạn tạo ra các sản phẩm sử dụng LLM mà không chỉ đơn giản là 1 cái LLM front-end, bạn nên nghiêm túc cân nhắc tới việc tự host your own LLM. Bỏ qua những lý do mà ai cũng nói tới như data ownership, Những lý do cho việc host your own LLM từ operation view bao gồm:

1, Bạn hoàn toàn dựa vào OpenAI and heck,  OpenAI support is non-existence
2, GPT models are wildly non-deterministics
3, Political correctness and censorship
4, Version control will be much painful
5, Do you really need a model at this cost?

# 1, Bạn hoàn toàn dựa vào OpenAI and heck,  OpenAI support is non-existence

Một lẽ dĩ nhiên, ta hoàn toàn dựa vào OpenAI khi sử dụng các giải pháp của họ. Tuy nhiên, OpenAI API không thật sự ổn định, và nghiêm trọng hơn, gần như không có 1 sự hỗ trợ nào cho khách hàng (chí ít là các khách hàng nhỏ). Về cơ bản, bạn không có cách nào để liên hệ với đội ngũ support của OpenAI. Hãy tưởng tượng nếu như OpenAI xảy ra lỗi và bạn không thể truy cập vào API của họ vào ngày sản phẩm launch, đó thật sự là 1 thảm họa.

Sử dụng hệ thống ticket của OpenAI, tôi chỉ nhận được duy nhất 1 phản hồi sau hơn 2 tháng. Đây là 1 điểm trừ rất lớn.

Không kể tới những lỗi lớn như server down thì tần suất API có vấn đề cũng rất cao. Với sự phát triển quá nóng, OpenAI chưa thể mature về mặt infra.

# 2, GPT models are wildly non-deterministics

Đây là 1 vấn đề không hề mới. Theo bài viết này https://152334h.github.io/blog/non-determinism-in-gpt-4/, thì mức độ các random responses (dù đã set temperature=0) rơi vào tầm 10-35%, 1 con số hoàn toàn không nhỏ.

![[Pasted image 20230817153819.png]]

Việc này còn đáng ngại hơn khi các model thay đổi version. Chuyện 1 hệ thống prompt hoạt động trơn tru ở 1 version nhưng lại gặp lỗi ở version kế tiếp là vấn đề tôi từng phải đối mặt.

Các Deterministic models chắc chắn sẽ dễ dàng hơn trong việc vận hành. Các model Llama2 7b và 13b, theo kiểm tra cá nhân, hoàn toàn deterministics. 
# 3, Political correctness and censorship

Gần đây, có 1 tựa game mới ra là Baldur's Gate 3 đã trở thành 1 trong những game có màn ra mắt thành công nhất trên Steam. Có 1 điều khiến tôi và các gamers rất thích thú là game có rất nhiều chi tiết gai góc, thậm chí có cả sex trong đó. Chính những đặc trưng mang đậm tính indie này đã góp 1 phần nhỏ trong việc giúp game chiếm được thiện cảm từ phía người chơi.

Nếu bạn muốn tạo ra những sản phẩm mang đậm dấu ấn riêng biệt, hoặc đơn giản hơn là các chủ đề 18+, bạn nên tìm cách xây dựng những LLM của riêng mình cho những việc này.
# 4, Version control will be much painful

OpenAI sẽ liên tục update các model mới, và ngừng hỗ trợ các model version cũ. Với việc 1 model version chỉ có thể dùng trong 6 tháng là quá ít ỏi, yêu cầu cần có 1 đội ngũ liên tục kiểm tra lại behavior của các model này. Nếu bạn chỉ đơn thuần dùng LLM để thực hiện hỏi đáp thông thường thì có lẽ điều này không bị ảnh hưởng quá nhiều, nhưng nếu bạn tự tạo 1 custom agent để giải quyết 1 số task chuyên biệt (generate query chẳng hạn), nó sẽ tốn thêm 1 lượng resource không đáng có cho việc này.
# 5, Do you really need a model at this cost?

Nếu bạn muốn host 1 model có khả năng so sánh được với GPT 3.5, nhiều khả năng bạn sẽ phải dùng Llama2-70b, và khi đó hầu như không có lợi ích gì về mặt chi phí cho chuyện inference cả [3]

Tuy nhiên, bạn có thật sự cần tới 1 model lớn như vậy? Nó sẽ rất phụ thuộc vào vấn đề bạn muốn giải quyết. Hoàn toàn có những model nhỏ hơn phù hợp với vấn đề của bạn.

![[Pasted image 20230818111758.png]]

Gần đây, Stability mới tung ra 1 LLM cho code, với chỉ 3b parameters. Hoặc như Replit, model replit-code của họ cũng chỉ là 3b. Những model này có thể được train/inference với yêu cầu về VRAM nhỏ hơn rất nhiều, khi đó, chi phí cho việc inference sẽ giảm đi hàng chục lần, và bạn sẽ có margin để thực hiện nhiều monertize plan hơn.
# Final thought

Tôi vẫn cho rằng tốt nhất, hãy bắt đầu protype, thậm chí thực hiện MVP bằng việc sử dụng các API từ OpenAI hoặc Anthropic. Tuy vậy, bạn cũng có thể cân nhắc tới việc tự host các LLM để tạo thành "moat" cho sản phẩm của mình. Việc này cũng có thể giúp hiểu sâu hơn về công nghệ, để thích ứng trong lĩnh vực đang thay đổi vô cùng nhanh chóng này.

# Tham khảo

http://marble.onl/posts/why_host_your_own_llm.html
https://152334h.github.io/blog/non-determinism-in-gpt-4/
[3] https://www.cursor.so/blog/llama-inference
[4] https://stability.ai/blog/stablecode-llm-generative-ai-coding
