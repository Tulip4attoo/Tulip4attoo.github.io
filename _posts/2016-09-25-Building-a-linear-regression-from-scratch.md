


Vì vậy version đầu tiên của tôi như sau:
```{python}
import pandas as pd
import numpy as np

class linear_regression:
    """docstring for ClassName"""
    def __init__(self, Y, X1, b0_0, b1_0, alpha = 0.01, epsilon = 0.001, max_loops = 10000):
        self.Y = np.array(Y)
        self.X1 = np.array(X1)
        self.info = None
        self.loop_times = 0
        self.max_loops = max_loops
        self.epsilon = epsilon
        self.length = len(Y)
        self.b0 = b0_0
        self.b1 = b1_0
        self.alpha = alpha

        if len(Y) != len(X1):
            print("heyyyy, Y and X have different length, len(Y) = %s meanwhile len(X) = %s"%(len(Y), len(X1)))


    def valuation(self, Y, X1, b0, b1, type = "RMSE"):
        if type == "RMSE":
            Y_hat = X1 * b1 + b0
            residuals = Y - Y_hat
            result = (residuals ** 2).sum()
            return result
        else:
        	print("other valuation types are under developing")
        	return None

    def lx_descent(self, b0, b1, alpha):
        f_b0 = (-2 * self.Y + 2 * b1 * self.X1).sum() + 2 * b0 * self.length
        f_b1 = (-2 * self.Y + 2 * b0 * self.X1 + 2 * b1 * self.X1 ** 2).sum()
        b0_new = b0 - alpha * f_b0
        b1_new = b1 - alpha * f_b1
        epsilon = abs(b0_new - b0) + abs(b1_new - b1)
        return b0_new, b1_new, epsilon

    def run(self):
        self.loop_times = 0
        for loop in xrange(0, 100000):
            self.b0, self.b1, epsilon = self.lx_descent(self.b0, self.b1, self.alpha)
            self.loop_times += 1
            if self.loop_times % 100 == 0:
                print("loop: %s"%self.loop_times)
            if epsilon < self.epsilon:
                print("done")
                print("b0 = %s, b1 = %s" %(self.b0, self.b1))
                return self.b0, self.b1
            if self.loop_times > self.max_loops:
                print("Run %s loops, still can not find a reasonable result"%self.loop_times)
                return None
```
Ok, let run it. I will try with:
X = [1,2,3,4,5]

Y = [2,3.9, 6, 8.1, 10]

b0 = 0.1

b1 = 0.3

linear_fit = linear_regression(Y, X, b0, b1)

linear_fit.run()
loop: 100
loop: 200
loop: 300
done
b0 = 23.9551182288, b1 = -5.98756846905
Out[22]: (23.955118228767581, -5.987568469050137)


Ok, it is terribly bad. Tôi cẩn thận chạy lại với scikit learn xem kết quả như thế nào, với niềm tin mơ hồ rằng nó đúng (dù rõ ràng là rất sai :'( ).

import matplotlib.pyplot as plt
import numpy as np
from sklearn import datasets, linear_model

regr = linear_model.LinearRegression()
x = X.reshape(5,1)
y = Y.reshape(5,1)
# Train the model using the training sets
regr.fit(x, y)

regr.coef_
Out[38]: array([[ 2.02]])

regr.intercept_
Out[39]: array([-0.06])

Ok, vậy là ta đã xác định được bản thân đã tính toán sai. Nhưng sai chỗ nào nhỉ? Tôi đồ rằng hoặc do alpha quá lớn, hoặc do epsilon quá lớn, nhung nhiều khả năng là do hàm descent của tôi bị sai, ngoài ra có thể do b0_0 và b1_0 quá kém (nhưng tôi không nghĩ vậy). Có lẽ nên check lại từng giả thiết.

Để kiểm tra, ta tạo 1 biến để chứa b0, b1, ta sẽ thêm vào:
        self.store_b0 = []
        self.store_b1 = []

            self.store_b0.append(self.b0)
            self.store_b1.append(self.b1)

store_b0 = linear_fit.store_b0

store_b1 = linear_fit.store_b1

plt.scatter(xrange(0,len(store_b0)), store_b0)
plt.show()

plt.scatter(xrange(0,len(store_b1)), store_b1)
plt.show()

Ok, vậy tức là do hàm descent sai. :/ 

Như vậy, chúng ta có thể xác định 2 vấn đề, là epsilon vẫn hơi lớn, alpha cũng hơi lớn, nhưng đó không phải nguyên nhân chính. Thực sự thì công tức tính hàm descent của chúng ta đã sai. Ok, như vậy chúng ta quay lại tính toán về mặt toán học.

Ok tính toán lại thì công thức bị sai. Để thử lại.

        f_b1 = (-2 * self.Y * self.X1 + 2 * b0 * self.X1 + 2 * b1 * self.X1 ** 2).sum()


Ok, kết quả ra khá ổn. Bây giờ ta sẽ thử với các alpha và epsilon khác nhau:
alpha = 0.001, epsilon = 0.0001

loop: 100
loop: 200
done
b0 = -0.0138066229828, b1 = 2.00720517528
Out[69]: (-0.013806622982849783, 2.0072051752794322)



alpha = 0.001, epsilon = 0.00001
loop: 1600
done
b0 = -0.0553811542096, b1 = 2.01872065378
Out[71]: (-0.055381154209596287, 2.0187206537794888)


alpha = 0.001, epsilon = 0.000001

loop: 2900
done
b0 = -0.0595381646069, b1 = 2.019872079
Out[73]: (-0.059538164606852156, 2.0198720790016522)



alpha = 0.0001, epsilon = 0.0000001
loop: 10000
Run 10001 loops, still can not find a reasonable result


alpha = 0.0001, epsilon = 0.0000001, max_loops = 100000
loop: 29600
done
b0 = -0.0595368657515, b1 = 2.01987171924
Out[77]: (-0.059536865751477742, 2.0198717192395406)

alpha = 0.0001, epsilon = 0.00000001, max_loops = 100000
loop: 43300
done
b0 = -0.0599536886468, b1 = 2.0199871725
Out[79]: (-0.05995368864680934, 2.0199871724977703)

Chúng ta có thể thấy b0 và b1 gần như hội tụ tại (-0.05995368864680934, 2.0199871724977703), chứ không phải -0.06 và 2.02 (dù sao nó cũng rất gần nhau). hãy test thử xem con số nào ra kết quả tốt hơn ^^

Tới đây, chúng ta coi như đã có vài kết quả ban đầu, và linear regression coi như đã ổn. Tuy vậy, vẫn còn rất nhiều vấn đề có thể khai thác thêm, ví dụ như:
+ Để ra con số -0.06 và 2.02, cần có epsilon như thế nào, alpha như thế nào (thực tế nó được gọi là delta). Ở đây chúng ta giảm epsilon, tăng alpha sẽ được kết quả tốt hơn, nhưng nên chọn như thế nào?
+ nên chọn kết quả như thế nào để tránh việc bị overfit? Giả sử như kết quả chúng ta tốt hơn (giả sử thôi), giữa kết quả (-0.05995368864680934, 2.0199871724977703) rất lẻ và con số đẹp như -0.06, 2.02, chúng ta nên chọn con số nào.

Quả thực, có làm thì mới thấy khó khăn @@. Dù sao cũng đã qua được bước đầu tiên rồi. Cá nhân cũng hiểu thêm được về gradient descent 1 phần. Tôi nghĩ tôi sẽ viết 1 bài blog về gradient descent sau.

Tôi cho rằng để có con số -0.06 và 2.02, có khả năng scikit learn không dùng gradient descent mà xài phương pháp nhân đại số. Tôi sẽ kiểm tra source code để có kết luận chính xác.