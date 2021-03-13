
Hôm nọ, mình có đọc 1 bài toán như thế này:

Tính số cách để biểu diễn 1 số N dưới dạng tổng của 1 và 3. Với N lớn, tính phần dư khi chia cho 10**9+7 (why 10^9+7? Because: https://www.geeksforgeeks.org/modulo-1097-1000000007/?ref=rp)

```
Input :  N = 4
Output : 4 
Explanation: 1+1+1+1 
             1+3
             3+1 
             4 

Input : N = 5 
Output : 4
Explanation: 1 + 1 + 1 + 1 + 1
             1 + 1 + 3
             1 + 3 + 1
             3 + 1 + 1
```

# Lời giải thông thường: tính hoán vị

Hoặc là chỉnh hợp tổ hợp gì đó =))) Cách này về cơ bản thì cũng đúng thôi, nhưng tính toán thì hơi phiền. 

# Một cách đánh giá khác

Lẽ dĩ nhiên, ta có: F(n) = F(n-1) + F(n-3).

Từ đây ta có 1 số cách làm như sau:

## Dùng đệ quy

Code nhanh thì như này:
```python
def F1(n):
    if n < 3:
        return 1
    else:
        return F1(n-1) + F1(n-3)
```

Dĩ nhiên cách này chậm, hãy đừng hỏi mình O(n) vì giờ là 1h đêm cmnr =)))

## Dùng array lưu giá trị

Nhanh hơn 1 chút, ta cải tiến bằng:

```python
def F2(n):
    DP = [0 for i in range(0, n + 1)] 
    DP[0] = DP[1] = DP[2] = 1
    DP[3] = 2
    for i in range(4, n + 1): 
        DP[i] = DP[i - 1] + DP[i - 3]
    return DP[n]
```

Cách này nhanh hơn nhiều, mỗi tội tốn bộ nhớ.

## Lưu tạm giá trị thay vì lưu vào bảng

Cải tiến vấn đề bộ nhớ của cách trên.

```python
def F3(n):
    if n < 3:
        return 1
    a, b, c = 1, 1, 1
    for i in range(3, n+1):
        a, b, c = a+c, a, b
    return a%1000000007
```

Cách này nhanh và ổn. Nhưng với N lớn, ví như 1 tỷ, chắc chắn nó chạy sẽ rất lâu bởi lẽ python xử lý lâu thật =))) Ví như đếm từ 0 tới 100 triệu đã mất hơn 6s thì đừng nghĩ tới 1 tỷ :)))

```
>>> start=time.time()
>>> for i in range(10**8):
...     continue
... 
>>> print(time.time() - start)
6.51268792152
```

Vậy với N lớn, tầm 1 tỷ thì ta phải làm như nào? Một cách tự nhiên (thật ra éo tự nhiên lắm haha), mình biết các bài toán dạng này luôn có 1 công thức để tính. Bằng 1 xíu thủ thuật, mình đã tìm ra công thức (thủ thuật google thôi =)))))

## Dùng công thức tính trực tiếp

Công thức đây:

```python
def F4(n):
    return round(0.6114919919508175*1.465571231876768**n)%1000000007
```

Về cơ bản cách này nhanh :))) Nhưng có 2 vấn đề nó gặp phải: 1 là overflow (hay từ khác nhỉ?), 2 là việc làm tròn với số thập phân sẽ dẫn tới kết quả không chính xác. Ok, vậy là tuy ấn tượng nhưng cách này không dùng với N lớn được.

## Và cách giải phức tạp nhưng chạy nhanh cuối cùng

Về cơ bản chúng ta có công thức sau

<p align="center">
  <img src="https://Tulip4attoo.github.io/assets/img/sum_by_1_and_3/khai_trien_ma_tran.png"><br>
  <i>Công thức sau khi tính toán</i>
</p>

Áp công thức này thì ta có đoạn code như này

```python
def mul_metrix_1(m1, m2):
    return (
        m1[0][0] * m2[0] + m1[0][1] * m2[1] + m1[0][2]*m2[2],
        m1[1][0] * m2[0] + m1[1][1] * m2[1] + m1[1][2]*m2[2],
        m1[2][0] * m2[0] + m1[2][1] * m2[1] + m1[2][2]*m2[2],
    )


def mul_matrix(m1, m2):
    const = 1000000007
    return (
        ((m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0])%const, (m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1] + m1[0][2] * m2[2][1])%const, (m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2] * m2[2][2])%const),
        ((m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0])%const, (m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1] + m1[1][2] * m2[2][1])%const, (m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2] * m2[2][2])%const),
        ((m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0])%const, (m1[2][0] * m2[0][1] + m1[2][1] * m2[1][1] + m1[2][2] * m2[2][1])%const, (m1[2][0] * m2[0][2] + m1[2][1] * m2[1][2] + m1[2][2] * m2[2][2])%const)
    )


def pow_matrix(m, n):
    if n == 1:
        return m
    elif n % 2 == 0:
        a = pow_matrix(m, n / 2)
        return mul_matrix(a, a)
    else:
        return mul_matrix(pow_matrix(m, n - 1), m)


def f(n):
    if n == 0:
        return 1
    if n == 1:
        return 1
    if n == 2:
        return 1
    a = ((1,0,1), (1,0,0), (0,1,0))
    an = pow_matrix(a, n)
    pair_0 = (1,1,1)
    pair_n = mul_metrix_1(an, pair_0)
    return pair_n[2]%1000000007
```

Áp công thức này, ta có thể tính F 1 tỷ rất nhanh. Nhanh thế nào?

```
>>> start=time.time()
>>> print(f(1000000000))
232795485
>>> print(time.time() - start)
0.00150990486145
```

Tada, tới đây là xong rồi. Cheer!

Tham khảo:
https://www.geeksforgeeks.org/modulo-1097-1000000007/?ref=rp
https://www.geeksforgeeks.org/count-ofdifferent-ways-express-n-sum-1-3-4/
https://kipalog.com/posts/Ban-ve-phuong-phap-toi-uu-tinh-tong-cac-so-Fibonacci

