# FP8: A Game-Changer for Quantization in Large Language Models (Featuring DeepSeek-V3)

In the previous post, we discussed how data types and quantization help improve speed and efficiency for Large Language Models (LLMs). We introduced float32, fp16, bf16, int8, and int4, covering common quantization techniques.

In this post, let’s dive into a recent innovation called **FP8**, which combines floating-point flexibility and low memory usage. We'll specifically explore how the new open-source **DeepSeek-V3 model** uses FP8 effectively.

## What Exactly is FP8?

FP8 stands for "8-bit floating point". It’s smaller than commonly-used float16 and bf16 types, using only 8 bits of memory per number.

Popular FP8 formats include:

- **E4M3** _(4 exponent bits, 3 mantissa bits)_  
- **E5M2** _(5 exponent bits, 2 mantissa bits)_

This short, floating-point representation provides two critical benefits:

- **Lower memory usage**: FP8 uses half as many bits as FP16/bf16, significantly reducing memory.
- **Floating-point range**: Unlike fixed-scale integers (like int8), FP8 can represent a wider dynamic range of very small or very large values thanks to its exponent.

## FP8 Compared to BF16, INT8, INT4

| Format | Bits | Type | Typical use-case | Accuracy & Stability | Memory efficiency |
|--------|------|------|------------------|----------------------|-------------------|
| BF16 | 16 | floating point | Mixed-precision training & inference | High accuracy, stable training (similar range to FP32) | Medium (2× more efficient than FP32) |
| FP8 | 8 | floating point | Cutting-edge training & inference (DeepSeek, future models) | Minimal accuracy loss if carefully handled | Highly efficient (4× vs FP32, 2× vs FP16/BF16) |
| INT8 | 8 | integer | Optimized inference, weights quantization | Minor accuracy loss if activations stay in high-precision | Highly efficient (4× vs FP32) |
| INT4 | 4 | integer | Extreme compression for specialized inference | Noticeable accuracy drop, specialized use | Extreme (8× vs FP32, 4× vs FP16) |

**FP8 finds an ideal middle-ground between accruate representation and memory efficiency.**

## Why FP8 is Attractive for LLMs?

Floating-point numbers store an exponent. This allows FP8 to represent a dynamic range of values better than integer (INT8/INT4). Thus, FP8 handles outlier values more gracefully, making it highly suitable for neural network activations and weights.

For example, Nvidia standardized FP8 quantization using combinations like:

- Weights in **E4M3** (slightly more precise).
- Activations in **E5M2** (better dynamic range).

Unlike INT8/INT4, FP8 provides "the best of both worlds":

- low memory footprint (comparable to INT8).
- broader dynamic range (closer to bf16/fp16).

## FP8 in Action: DeepSeek-V3 Case Study

DeepSeek-V3 is a recently launched open-source large language model praised highly by the research community. One groundbreaking feature is its extensive use of FP8 quantization for training and inference.

### Mixed-Precision Approach in DeepSeek

DeepSeek doesn’t just blindly convert all computations to FP8. Instead, it uses a **mixed-precision strategy**:

- Heavy math computations (matmul/GEMM): FP8
- Embedding layers, Layer Norm, Softmax, MoE Gates: bf16/fp16 (higher precision)
- Gradients & optimizer states: bf16
- Sums/accumulations in training: fp32 or bf16 (high precision)

This careful approach ensures numerical stability.

**As the DeepSeek team clearly states:** 
> "DeepSeek-V3 does math in FP8, but accumulates results at higher precision to prevent numeric drift."

(This approach mirrors NVIDIA’s Transformer Engine, which also does multiplications in FP8 but accumulates at FP32/BF16 for greater stability.)

### Impressive Stability and Accuracy

The results are remarkable:

- **Accuracy**: DeepSeek-V3 with FP8 training reached nearly identical accuracy to BF16—loss difference within **0.25%** over trillions of training tokens.
- **Stability**: No observed instabilities such as loss spikes or divergences during training.

These findings extend earlier FP8 research (limited to smaller models <175B parameters) to an unprecedented 671B-parameter scale. DeepSeek-V3’s FP8 implementation is state-of-the-art among open-source models, matching even the best closed-source models.

## Efficiency Benefits and Hardware Acceleration

FP8 enables huge efficiency and scaling gains:

- FP8 vs BF16 is around **2× faster** in computations and consumes **half the memory**.
- DeepSeek-V3 training run (14.8T tokens) required only about 2.66 million GPU-hours (on NVIDIA H800 "_Hopper_" GPUs)—a significantly lower computational cost directly made possible by FP8.  

Specific benchmarks highlight FP8’s massive gains:

| Model & comparison | Memory Reduction | Speedup relative to higher precision (BF16) |
|--------------------|------------------|--------------------------------------------|
| FP8 training (Peng et al., 2023) | 39% | 75% faster |
| vLLM’s DeepSeek-V3 inference | 43% (15GB → 8.5GB) | Allows significantly increased context (from ~50k tokens to up to 512k tokens) |

### FP8 Hardware: NVIDIA Hopper Architecture

FP8 is natively supported on NVIDIA’s newest Hopper GPU architecture, explicitly developed for FP8:

- **Dedicated FP8 tensor cores** double the throughput compared to FP16/BF16.
- Achieve equivalent results in less time and using far fewer resources.

Future architectures (such as NVIDIA H200) expand these capabilities even more dramatically, facilitating previously impractical model sizes within a single-node cluster.

**Example:**  
> On NVIDIA H200 GPUs (up to 141GB memory per GPU), the FP8-compressed 671B DeepSeek-V3 model could be effectively inferenced entirely within a single node setup—a scenario impossible without FP8 quantization.

## Takeaway Comparison

| Feature | FP8 |
|---------|-----|
| Memory Efficiency |✅✅ Excellent|
| Precision & Stability|✅ High (with careful design)|
| Dynamic Range Flexibility|✅✅ Very good|
| Hardware Support|✅ NVIDIA Hopper GPUs, future architectures|
| Real-world success|✅ Impressive results in DeepSeek-V3 deployments|

## The Future of FP8 in LLM Quantization

With DeepSeek successfully pioneering FP8 at unprecedented scales, other future LLMs and open-source models are expected to follow this revolutionary quantization strategy.

Even though FP8 requires thoughtful implementation to ensure stability, its combination of speed, efficiency, and accuracy makes it perhaps the most exciting recent advance in quantizing large generative models.

## Summary & Practical Advice

FP8 brings substantial practical benefits:

- FP8 achieves massive memory reduction (4× FP32 size).
- Ensures minimal accuracy loss, provided strategies like mixed-precision and selective precision are used.
- Broad support from NVIDIA and AMD architectures will likely drive industry-wide FP8 adoption.

Moving forward, keep an eye on FP8 quantization developments, especially as hardware support becomes commonplace.

---

📌 **Recap the previous post for context**: [Understanding Data Types and Quantization in LLMs (part 1)](#)

✏️ **Try it yourself**:  
- [DeepSeek-V3 (Hugging Face)](https://huggingface.co/deepseek-ai)
- [NVIDIA's FP8 Documentation](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/)

---

In short: FP8 isn’t just another small step—it’s genuinely a transformative leap forward in LLM efficiency.