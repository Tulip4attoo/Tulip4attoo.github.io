---
layout:         post
title:          Viết keras model trong TensorFlow 2.x (phần 1) - cách viết Keras Functional API
date:           2019-11-01
mathjax:        true
comments:       true
description:    Bài viết đầu tiên trong series nói về cách viết keras model trong TensorFlow 2.0. Cụ thể, bài viết nói về 3 cách viết model bằng Keras, sau đó minh họa bằng cách tạo lập model Resnet 50.
img:            assets/img/keras_model/keras+tf.jpg
author:         Tulip
---

# Giới thiệu về Keras và TensorFlow

`TensorFlow` thì mình đã từng có lần giới thiệu ở [đây](http://tulip4attoo.github.io/dung-tensorflow-giai-quyet-fizzbuzz/). Sau 2 năm, các framework deep learning đã có rất nhiều thay đổi, pytorch đã vươn lên trở thành framework chủ đạo trong giới academic, `tensorflow` thì vẫn giữ vị thế số 1 ở thị trường industry. Các framework cũng dần trở nên trưởng thành hơn, và 1 tương lai khi các framework tương đối tương đồng nhau sắp tới. 

`Keras` từ vị trí 1 python library hỗ trợ cho các framework deep learning, đã trở thành API chính được Google khuyến khích sử dụng trong `TensorFlow` 2.x. Cách viết session ở các bản 1.x cũng không còn nữa, vì vậy, nếu bạn sử dụng `TensorFlow`, bạn nên lập tức upgrade lên bản 2.0 và sử dụng `tf.keras`.

# Về những kiểu viết model bằng Keras

Trong phiên bản TensorFlow 2.0, có 3 cách để tạo ra 1 neural network model:

+ Sequential API
+ Functional API
+ Model subclassing

<p align="center">
  <img src="../assets/img/keras_model/keras_3_model_types_header.png"><br>
  <i>3 kiểu viết model của Keras trong TensorFlow 2.0</i>
</p>

3 kiểu này có những đặc điểm riêng, do đó cũng có những điểm mạnh điểm yếu riêng biệt:

+ Sequential API: cách viết đơn giản, tuy nhiên sẽ không dựng được các shared layer (residual block chẳng hạn), không handle được multiple inputs/outputs, do đó không dựng được 1 số model như Resnet, MVCNN,...

+ Functional API: cách viết có phần tương tự tensorflow graph version 1.x, tuy vậy vẫn có khả năng tạo được các model phức tạp, các layers có khả năng sharing 1 cách đơn giản. Thêm vào đó, tất cả các Sequential model đều có thể tạo được bằng Functional model.

+ Model subclassing: cách viết có phần tương tự pytorch subclassing. Có khả năng viết được các model phức tạp cũng như các khả năng khác của Functional model.

Với cá nhân mình, mình sử dụng cách viết Functional API trong công việc. Đây là cách viết đủ đơn giản, nhưng rất mạnh mẽ, tới giờ các model phức tạp như CRAFT mình đều có thể viết bằng dạng Functional. Chưa kể tới, các pre-model trong Keras cũng được viết theo dạng này, ví dụ như [Inception-Resnet-v2](https://github.com/keras-team/keras-applications/blob/master/keras_applications/inception_resnet_v2.py).

Vậy, ta nên viết model dạng Functional như thế nào?

# Flow khi sử dụng Keras

Khi sử dụng Keras để giải quyết các bài toán machine learning, mình sẽ thực hiện theo flow như sau:

- viết lớp input. Chú ý trong việc tạo shape của input cho chính xác.
- viết các layers giữa của network. Tùy thuộc vào network mà việc này sẽ phức tạp hoặc là không, tuy nhiên phần đa đều khá đơn giản.
- tiến hành feed input layer và output layer vào tf.keras.models.Model. Xong bước này thì chỉ cần gọi ra là ta đã có model rồi.

Nghe khá đơn giản phải không? Thực ra nhờ Keras mà nó thực sự đúng là đơn giản như vậy đó. Hồi xưa viết thuần Tensorflow thì cực hơn khá là nhiều.

# Cách viết Keras model dạng Functional

Để minh họa cho việc tạo model dạng Functional, mình sẽ viết lại Resnet 50. Nếu nói cặn kẽ hơn về Keras thì sẽ khá mất thời gian, cũng như khiến bài viết dài hơn rất nhiều, do đó mình sẽ viết cho các bạn đã từng biết chút chút về Keras sử dụng.

<p align="center">
  <img src="../assets/img/keras_model/resnet50.png"><br>
  <i>Cấu trúc Resnet50 nè</i>
</p>


Trước hết, ta cần import 1 số package cần thiết (chú ý sử dụng TF 2.0)

```python
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras import models
```

Trong Resnet, có 2 loại residual block. Chúng ta sẽ viết ra các hàm để tính toán residual block này. Các hàm này có input nhận 1 layer là input, output cho ra 1 layer sau khi đã thực hiện qua các nodes tính toán. Ta sẽ viết cái residual block này trước:

```python
def identity_block(input_tensor, kernel_size, filters):
    filters1, filters2, filters3 = filters
    bn_axis = 3  # channel_last

    x = layers.Conv2D(filters1, (1, 1),
                      kernel_initializer='he_normal')(input_tensor)
    x = layers.BatchNormalization(axis=bn_axis)(x)
    x = layers.Activation('relu')(x)

    x = layers.Conv2D(filters2, kernel_size, padding='same',
                      kernel_initializer='he_normal')(x)
    x = layers.BatchNormalization(axis=bn_axis)(x)
    x = layers.Activation('relu')(x)

    x = layers.Conv2D(filters3, (1, 1),
                      kernel_initializer='he_normal')(x)
    x = layers.BatchNormalization(axis=bn_axis)(x)

    x = layers.add([x, input_tensor])
    x = layers.Activation('relu')(x)
    return x
```

Mình sẽ phân tích 1 chút. Trước tiên, trong hàm có sử dụng 1 vài biến số:

- `input_tensor` là input tensor cho residual block này (hmm, hiển nhiên)
- `kernel_size` là kernel_size chung cho các lớp Conv2D phía trong của block này. Về cơ bản thì `kernel_size=3`.
- `filters` là 1 list chứa các giá trị filter được dùng cho các lớp Conv2D phía trong của block.

Về phía trong hàm, chúng ta sẽ tạo ra 1 branch mới, sau đó cộng với branch cũ để ra kết quả sau cùng. Cụ thể:

- nhánh Conv2D rồi BatchNorm sau cùng chính là branch tính toán Convo bình thường.
- nhánh `input_tensor` sau đó được cộng vào bằng phép `layers.add`, đây chính là phép gôpj 2 brnch lại làm 1.
- sau đó cho qua lớp `layers.Activation` để có output.

Chúng ta chú ý, có thể đơn giản đặt các tên cho các layers nào mình cần dùng, nếu như mong muốn có thể sử dụng layers đó sau này, như việc chúng ta gọi input là `input_tensor` vậy.

Tương tự vậy, ta viết thêm 1 dạng residual block nữa. Block này có kết cấu tương tự block trên.

```python
def conv_block(input_tensor, kernel_size, filters, strides=(2, 2)):
    filters1, filters2, filters3 = filters
    bn_axis = 3  # channel_last

    x = layers.Conv2D(filters1, (1, 1), strides=strides,
                      kernel_initializer='he_normal')(input_tensor)
    x = layers.BatchNormalization(axis=bn_axis)(x)
    x = layers.Activation('relu')(x)

    x = layers.Conv2D(filters2, kernel_size, padding='same',
                      kernel_initializer='he_normal')(x)
    x = layers.BatchNormalization(axis=bn_axis)(x)
    x = layers.Activation('relu')(x)

    x = layers.Conv2D(filters3, (1, 1),
                      kernel_initializer='he_normal')(x)
    x = layers.BatchNormalization(axis=bn_axis)(x)

    shortcut = layers.Conv2D(filters3, (1, 1), strides=strides,
                             kernel_initializer='he_normal')(input_tensor)
    shortcut = layers.BatchNormalization(axis=bn_axis)(shortcut)

    x = layers.add([x, shortcut])
    x = layers.Activation('relu')(x)
    return x
```

Sau đó, ta viết 1 model chính để kết nối 2 block trên với phần thân của model. Model chính cần có Input được khai báo. Cụ thể:

```python
def ResNet50(classes=1000):
    bn_axis = 3  # channel_last
    img_input = layers.Input(shape=(224, 224, 3))

    x = layers.ZeroPadding2D(padding=(3, 3), name='conv1_pad')(img_input)
    x = layers.Conv2D(64, (7, 7), strides=(2, 2), padding='valid',
                      kernel_initializer='he_normal')(x)
    x = layers.BatchNormalization(axis=bn_axis, name='bn_conv1')(x)
    x = layers.Activation('relu')(x)
    x = layers.ZeroPadding2D(padding=(1, 1), name='pool1_pad')(x)
    x = layers.MaxPooling2D((3, 3), strides=(2, 2))(x)

    x = conv_block(x, 3, [64, 64, 256], stage=2, block='a', strides=(1, 1))
    x = identity_block(x, 3, [64, 64, 256], stage=2, block='b')
    x = identity_block(x, 3, [64, 64, 256], stage=2, block='c')

    x = conv_block(x, 3, [128, 128, 512], stage=3, block='a')
    x = identity_block(x, 3, [128, 128, 512], stage=3, block='b')
    x = identity_block(x, 3, [128, 128, 512], stage=3, block='c')
    x = identity_block(x, 3, [128, 128, 512], stage=3, block='d')

    x = conv_block(x, 3, [256, 256, 1024], stage=4, block='a')
    x = identity_block(x, 3, [256, 256, 1024], stage=4, block='b')
    x = identity_block(x, 3, [256, 256, 1024], stage=4, block='c')
    x = identity_block(x, 3, [256, 256, 1024], stage=4, block='d')
    x = identity_block(x, 3, [256, 256, 1024], stage=4, block='e')
    x = identity_block(x, 3, [256, 256, 1024], stage=4, block='f')

    x = conv_block(x, 3, [512, 512, 2048], stage=5, block='a')
    x = identity_block(x, 3, [512, 512, 2048], stage=5, block='b')
    x = identity_block(x, 3, [512, 512, 2048], stage=5, block='c')

    x = layers.GlobalAveragePooling2D(name='avg_pool')(x)
    x = layers.Dense(classes, activation='softmax', name='fc1000')(x)

    # Create model.
    model = models.Model(inputs=img_input, outputs=x, name='resnet50')

    return model
```

Mình sẽ nói về 1 số điểm quan trọng:

- chúng ta cần khai báo 1 lớp Input (hoặc nhiều nếu như model có multiple inputs). Ở đây, chúng ta có thể khai báo shape của input là dạng số cụ thể, hoặc dạng dynamic `Input(shape=(None, None, 3))`. Tuy nhiên, chỉ những mạng full convo mới có thể khai báo dạng dynamic này được.
- chúng ta cứ pass các layer như thông thường. 
- ở cuối hàm, chúng ta cần feed inputs, outputs cho Model là được. Chú ý inputs phải có dạng Input tensor.

Tới đây, chúng ta đã xong 1 model. Bạn có thể xem file hoàn chỉnh ở [đây](https://github.com/Tulip4attoo/Tulip4attoo.github.io/blob/master/assets/codes/keras_model/resnet50.py)

Chúng ta có thể kiểm tra model vừa viết. Phần kết quả summary khá dài nên mình sẽ cho xuống cuối bài.

```python
import resnet50

model = resnet50.Resnet50()
model.summary()
```

Tới đây, chúng ta có thể coi như đã biết qua cách viết 1 model theo phong cách Functional trong Keras. Tất nhiên, thế này vẫn chưa train được, nhưng bài viết thì hơi dài quá rồi, nên phần training mình sẽ để trong bài viết sau vậy. Cheer!

# Notes

Thực ra TensorFlow 2.0 còn 1 cách viết nữa, dựa theo kiểu thuần auto differatation. Tuy nhiên cá nhân mình thấy viết kiểu Functional là đủ chiến gần như 100% các model cho công việc bình thường rồi, nên mình sẽ không nhắc tới ở đây (cá nhân mình cũng không biết viết dạng này hehe).

Trong những bài viết tiếp theo, mình sẽ viết về cách train model, cũng như cách viết custom loss function trong keras.

À, và đây là kết quả khi summary model.

```
>>> model.summary()
Model: "resnet50"
__________________________________________________________________________________________________
Layer (type)                    Output Shape         Param #     Connected to                     
==================================================================================================
input_2 (InputLayer)            [(None, 224, 224, 3) 0                                            
__________________________________________________________________________________________________
conv1_pad (ZeroPadding2D)       (None, 230, 230, 3)  0           input_2[0][0]                    
__________________________________________________________________________________________________
conv2d_53 (Conv2D)              (None, 112, 112, 64) 9472        conv1_pad[0][0]                  
__________________________________________________________________________________________________
bn_conv1 (BatchNormalization)   (None, 112, 112, 64) 256         conv2d_53[0][0]                  
__________________________________________________________________________________________________
activation_49 (Activation)      (None, 112, 112, 64) 0           bn_conv1[0][0]                   
__________________________________________________________________________________________________
pool1_pad (ZeroPadding2D)       (None, 114, 114, 64) 0           activation_49[0][0]              
__________________________________________________________________________________________________
max_pooling2d_1 (MaxPooling2D)  (None, 56, 56, 64)   0           pool1_pad[0][0]                  
__________________________________________________________________________________________________
conv2d_54 (Conv2D)              (None, 56, 56, 64)   4160        max_pooling2d_1[0][0]            
__________________________________________________________________________________________________
batch_normalization_52 (BatchNo (None, 56, 56, 64)   256         conv2d_54[0][0]                  
__________________________________________________________________________________________________
activation_50 (Activation)      (None, 56, 56, 64)   0           batch_normalization_52[0][0]     
__________________________________________________________________________________________________
conv2d_55 (Conv2D)              (None, 56, 56, 64)   36928       activation_50[0][0]              
__________________________________________________________________________________________________
batch_normalization_53 (BatchNo (None, 56, 56, 64)   256         conv2d_55[0][0]                  
__________________________________________________________________________________________________
activation_51 (Activation)      (None, 56, 56, 64)   0           batch_normalization_53[0][0]     
__________________________________________________________________________________________________
conv2d_56 (Conv2D)              (None, 56, 56, 256)  16640       activation_51[0][0]              
__________________________________________________________________________________________________
conv2d_57 (Conv2D)              (None, 56, 56, 256)  16640       max_pooling2d_1[0][0]            
__________________________________________________________________________________________________
batch_normalization_54 (BatchNo (None, 56, 56, 256)  1024        conv2d_56[0][0]                  
__________________________________________________________________________________________________
batch_normalization_55 (BatchNo (None, 56, 56, 256)  1024        conv2d_57[0][0]                  
__________________________________________________________________________________________________
add_16 (Add)                    (None, 56, 56, 256)  0           batch_normalization_54[0][0]     
                                                                 batch_normalization_55[0][0]     
__________________________________________________________________________________________________
activation_52 (Activation)      (None, 56, 56, 256)  0           add_16[0][0]                     
__________________________________________________________________________________________________
conv2d_58 (Conv2D)              (None, 56, 56, 64)   16448       activation_52[0][0]              
__________________________________________________________________________________________________
batch_normalization_56 (BatchNo (None, 56, 56, 64)   256         conv2d_58[0][0]                  
__________________________________________________________________________________________________
activation_53 (Activation)      (None, 56, 56, 64)   0           batch_normalization_56[0][0]     
__________________________________________________________________________________________________
conv2d_59 (Conv2D)              (None, 56, 56, 64)   36928       activation_53[0][0]              
__________________________________________________________________________________________________
batch_normalization_57 (BatchNo (None, 56, 56, 64)   256         conv2d_59[0][0]                  
__________________________________________________________________________________________________
activation_54 (Activation)      (None, 56, 56, 64)   0           batch_normalization_57[0][0]     
__________________________________________________________________________________________________
conv2d_60 (Conv2D)              (None, 56, 56, 256)  16640       activation_54[0][0]              
__________________________________________________________________________________________________
batch_normalization_58 (BatchNo (None, 56, 56, 256)  1024        conv2d_60[0][0]                  
__________________________________________________________________________________________________
add_17 (Add)                    (None, 56, 56, 256)  0           batch_normalization_58[0][0]     
                                                                 activation_52[0][0]              
__________________________________________________________________________________________________
activation_55 (Activation)      (None, 56, 56, 256)  0           add_17[0][0]                     
__________________________________________________________________________________________________
conv2d_61 (Conv2D)              (None, 56, 56, 64)   16448       activation_55[0][0]              
__________________________________________________________________________________________________
batch_normalization_59 (BatchNo (None, 56, 56, 64)   256         conv2d_61[0][0]                  
__________________________________________________________________________________________________
activation_56 (Activation)      (None, 56, 56, 64)   0           batch_normalization_59[0][0]     
__________________________________________________________________________________________________
conv2d_62 (Conv2D)              (None, 56, 56, 64)   36928       activation_56[0][0]              
__________________________________________________________________________________________________
batch_normalization_60 (BatchNo (None, 56, 56, 64)   256         conv2d_62[0][0]                  
__________________________________________________________________________________________________
activation_57 (Activation)      (None, 56, 56, 64)   0           batch_normalization_60[0][0]     
__________________________________________________________________________________________________
conv2d_63 (Conv2D)              (None, 56, 56, 256)  16640       activation_57[0][0]              
__________________________________________________________________________________________________
batch_normalization_61 (BatchNo (None, 56, 56, 256)  1024        conv2d_63[0][0]                  
__________________________________________________________________________________________________
add_18 (Add)                    (None, 56, 56, 256)  0           batch_normalization_61[0][0]     
                                                                 activation_55[0][0]              
__________________________________________________________________________________________________
activation_58 (Activation)      (None, 56, 56, 256)  0           add_18[0][0]                     
__________________________________________________________________________________________________
conv2d_64 (Conv2D)              (None, 28, 28, 128)  32896       activation_58[0][0]              
__________________________________________________________________________________________________
batch_normalization_62 (BatchNo (None, 28, 28, 128)  512         conv2d_64[0][0]                  
__________________________________________________________________________________________________
activation_59 (Activation)      (None, 28, 28, 128)  0           batch_normalization_62[0][0]     
__________________________________________________________________________________________________
conv2d_65 (Conv2D)              (None, 28, 28, 128)  147584      activation_59[0][0]              
__________________________________________________________________________________________________
batch_normalization_63 (BatchNo (None, 28, 28, 128)  512         conv2d_65[0][0]                  
__________________________________________________________________________________________________
activation_60 (Activation)      (None, 28, 28, 128)  0           batch_normalization_63[0][0]     
__________________________________________________________________________________________________
conv2d_66 (Conv2D)              (None, 28, 28, 512)  66048       activation_60[0][0]              
__________________________________________________________________________________________________
conv2d_67 (Conv2D)              (None, 28, 28, 512)  131584      activation_58[0][0]              
__________________________________________________________________________________________________
batch_normalization_64 (BatchNo (None, 28, 28, 512)  2048        conv2d_66[0][0]                  
__________________________________________________________________________________________________
batch_normalization_65 (BatchNo (None, 28, 28, 512)  2048        conv2d_67[0][0]                  
__________________________________________________________________________________________________
add_19 (Add)                    (None, 28, 28, 512)  0           batch_normalization_64[0][0]     
                                                                 batch_normalization_65[0][0]     
__________________________________________________________________________________________________
activation_61 (Activation)      (None, 28, 28, 512)  0           add_19[0][0]                     
__________________________________________________________________________________________________
conv2d_68 (Conv2D)              (None, 28, 28, 128)  65664       activation_61[0][0]              
__________________________________________________________________________________________________
batch_normalization_66 (BatchNo (None, 28, 28, 128)  512         conv2d_68[0][0]                  
__________________________________________________________________________________________________
activation_62 (Activation)      (None, 28, 28, 128)  0           batch_normalization_66[0][0]     
__________________________________________________________________________________________________
conv2d_69 (Conv2D)              (None, 28, 28, 128)  147584      activation_62[0][0]              
__________________________________________________________________________________________________
batch_normalization_67 (BatchNo (None, 28, 28, 128)  512         conv2d_69[0][0]                  
__________________________________________________________________________________________________
activation_63 (Activation)      (None, 28, 28, 128)  0           batch_normalization_67[0][0]     
__________________________________________________________________________________________________
conv2d_70 (Conv2D)              (None, 28, 28, 512)  66048       activation_63[0][0]              
__________________________________________________________________________________________________
batch_normalization_68 (BatchNo (None, 28, 28, 512)  2048        conv2d_70[0][0]                  
__________________________________________________________________________________________________
add_20 (Add)                    (None, 28, 28, 512)  0           batch_normalization_68[0][0]     
                                                                 activation_61[0][0]              
__________________________________________________________________________________________________
activation_64 (Activation)      (None, 28, 28, 512)  0           add_20[0][0]                     
__________________________________________________________________________________________________
conv2d_71 (Conv2D)              (None, 28, 28, 128)  65664       activation_64[0][0]              
__________________________________________________________________________________________________
batch_normalization_69 (BatchNo (None, 28, 28, 128)  512         conv2d_71[0][0]                  
__________________________________________________________________________________________________
activation_65 (Activation)      (None, 28, 28, 128)  0           batch_normalization_69[0][0]     
__________________________________________________________________________________________________
conv2d_72 (Conv2D)              (None, 28, 28, 128)  147584      activation_65[0][0]              
__________________________________________________________________________________________________
batch_normalization_70 (BatchNo (None, 28, 28, 128)  512         conv2d_72[0][0]                  
__________________________________________________________________________________________________
activation_66 (Activation)      (None, 28, 28, 128)  0           batch_normalization_70[0][0]     
__________________________________________________________________________________________________
conv2d_73 (Conv2D)              (None, 28, 28, 512)  66048       activation_66[0][0]              
__________________________________________________________________________________________________
batch_normalization_71 (BatchNo (None, 28, 28, 512)  2048        conv2d_73[0][0]                  
__________________________________________________________________________________________________
add_21 (Add)                    (None, 28, 28, 512)  0           batch_normalization_71[0][0]     
                                                                 activation_64[0][0]              
__________________________________________________________________________________________________
activation_67 (Activation)      (None, 28, 28, 512)  0           add_21[0][0]                     
__________________________________________________________________________________________________
conv2d_74 (Conv2D)              (None, 28, 28, 128)  65664       activation_67[0][0]              
__________________________________________________________________________________________________
batch_normalization_72 (BatchNo (None, 28, 28, 128)  512         conv2d_74[0][0]                  
__________________________________________________________________________________________________
activation_68 (Activation)      (None, 28, 28, 128)  0           batch_normalization_72[0][0]     
__________________________________________________________________________________________________
conv2d_75 (Conv2D)              (None, 28, 28, 128)  147584      activation_68[0][0]              
__________________________________________________________________________________________________
batch_normalization_73 (BatchNo (None, 28, 28, 128)  512         conv2d_75[0][0]                  
__________________________________________________________________________________________________
activation_69 (Activation)      (None, 28, 28, 128)  0           batch_normalization_73[0][0]     
__________________________________________________________________________________________________
conv2d_76 (Conv2D)              (None, 28, 28, 512)  66048       activation_69[0][0]              
__________________________________________________________________________________________________
batch_normalization_74 (BatchNo (None, 28, 28, 512)  2048        conv2d_76[0][0]                  
__________________________________________________________________________________________________
add_22 (Add)                    (None, 28, 28, 512)  0           batch_normalization_74[0][0]     
                                                                 activation_67[0][0]              
__________________________________________________________________________________________________
activation_70 (Activation)      (None, 28, 28, 512)  0           add_22[0][0]                     
__________________________________________________________________________________________________
conv2d_77 (Conv2D)              (None, 14, 14, 256)  131328      activation_70[0][0]              
__________________________________________________________________________________________________
batch_normalization_75 (BatchNo (None, 14, 14, 256)  1024        conv2d_77[0][0]                  
__________________________________________________________________________________________________
activation_71 (Activation)      (None, 14, 14, 256)  0           batch_normalization_75[0][0]     
__________________________________________________________________________________________________
conv2d_78 (Conv2D)              (None, 14, 14, 256)  590080      activation_71[0][0]              
__________________________________________________________________________________________________
batch_normalization_76 (BatchNo (None, 14, 14, 256)  1024        conv2d_78[0][0]                  
__________________________________________________________________________________________________
activation_72 (Activation)      (None, 14, 14, 256)  0           batch_normalization_76[0][0]     
__________________________________________________________________________________________________
conv2d_79 (Conv2D)              (None, 14, 14, 1024) 263168      activation_72[0][0]              
__________________________________________________________________________________________________
conv2d_80 (Conv2D)              (None, 14, 14, 1024) 525312      activation_70[0][0]              
__________________________________________________________________________________________________
batch_normalization_77 (BatchNo (None, 14, 14, 1024) 4096        conv2d_79[0][0]                  
__________________________________________________________________________________________________
batch_normalization_78 (BatchNo (None, 14, 14, 1024) 4096        conv2d_80[0][0]                  
__________________________________________________________________________________________________
add_23 (Add)                    (None, 14, 14, 1024) 0           batch_normalization_77[0][0]     
                                                                 batch_normalization_78[0][0]     
__________________________________________________________________________________________________
activation_73 (Activation)      (None, 14, 14, 1024) 0           add_23[0][0]                     
__________________________________________________________________________________________________
conv2d_81 (Conv2D)              (None, 14, 14, 256)  262400      activation_73[0][0]              
__________________________________________________________________________________________________
batch_normalization_79 (BatchNo (None, 14, 14, 256)  1024        conv2d_81[0][0]                  
__________________________________________________________________________________________________
activation_74 (Activation)      (None, 14, 14, 256)  0           batch_normalization_79[0][0]     
__________________________________________________________________________________________________
conv2d_82 (Conv2D)              (None, 14, 14, 256)  590080      activation_74[0][0]              
__________________________________________________________________________________________________
batch_normalization_80 (BatchNo (None, 14, 14, 256)  1024        conv2d_82[0][0]                  
__________________________________________________________________________________________________
activation_75 (Activation)      (None, 14, 14, 256)  0           batch_normalization_80[0][0]     
__________________________________________________________________________________________________
conv2d_83 (Conv2D)              (None, 14, 14, 1024) 263168      activation_75[0][0]              
__________________________________________________________________________________________________
batch_normalization_81 (BatchNo (None, 14, 14, 1024) 4096        conv2d_83[0][0]                  
__________________________________________________________________________________________________
add_24 (Add)                    (None, 14, 14, 1024) 0           batch_normalization_81[0][0]     
                                                                 activation_73[0][0]              
__________________________________________________________________________________________________
activation_76 (Activation)      (None, 14, 14, 1024) 0           add_24[0][0]                     
__________________________________________________________________________________________________
conv2d_84 (Conv2D)              (None, 14, 14, 256)  262400      activation_76[0][0]              
__________________________________________________________________________________________________
batch_normalization_82 (BatchNo (None, 14, 14, 256)  1024        conv2d_84[0][0]                  
__________________________________________________________________________________________________
activation_77 (Activation)      (None, 14, 14, 256)  0           batch_normalization_82[0][0]     
__________________________________________________________________________________________________
conv2d_85 (Conv2D)              (None, 14, 14, 256)  590080      activation_77[0][0]              
__________________________________________________________________________________________________
batch_normalization_83 (BatchNo (None, 14, 14, 256)  1024        conv2d_85[0][0]                  
__________________________________________________________________________________________________
activation_78 (Activation)      (None, 14, 14, 256)  0           batch_normalization_83[0][0]     
__________________________________________________________________________________________________
conv2d_86 (Conv2D)              (None, 14, 14, 1024) 263168      activation_78[0][0]              
__________________________________________________________________________________________________
batch_normalization_84 (BatchNo (None, 14, 14, 1024) 4096        conv2d_86[0][0]                  
__________________________________________________________________________________________________
add_25 (Add)                    (None, 14, 14, 1024) 0           batch_normalization_84[0][0]     
                                                                 activation_76[0][0]              
__________________________________________________________________________________________________
activation_79 (Activation)      (None, 14, 14, 1024) 0           add_25[0][0]                     
__________________________________________________________________________________________________
conv2d_87 (Conv2D)              (None, 14, 14, 256)  262400      activation_79[0][0]              
__________________________________________________________________________________________________
batch_normalization_85 (BatchNo (None, 14, 14, 256)  1024        conv2d_87[0][0]                  
__________________________________________________________________________________________________
activation_80 (Activation)      (None, 14, 14, 256)  0           batch_normalization_85[0][0]     
__________________________________________________________________________________________________
conv2d_88 (Conv2D)              (None, 14, 14, 256)  590080      activation_80[0][0]              
__________________________________________________________________________________________________
batch_normalization_86 (BatchNo (None, 14, 14, 256)  1024        conv2d_88[0][0]                  
__________________________________________________________________________________________________
activation_81 (Activation)      (None, 14, 14, 256)  0           batch_normalization_86[0][0]     
__________________________________________________________________________________________________
conv2d_89 (Conv2D)              (None, 14, 14, 1024) 263168      activation_81[0][0]              
__________________________________________________________________________________________________
batch_normalization_87 (BatchNo (None, 14, 14, 1024) 4096        conv2d_89[0][0]                  
__________________________________________________________________________________________________
add_26 (Add)                    (None, 14, 14, 1024) 0           batch_normalization_87[0][0]     
                                                                 activation_79[0][0]              
__________________________________________________________________________________________________
activation_82 (Activation)      (None, 14, 14, 1024) 0           add_26[0][0]                     
__________________________________________________________________________________________________
conv2d_90 (Conv2D)              (None, 14, 14, 256)  262400      activation_82[0][0]              
__________________________________________________________________________________________________
batch_normalization_88 (BatchNo (None, 14, 14, 256)  1024        conv2d_90[0][0]                  
__________________________________________________________________________________________________
activation_83 (Activation)      (None, 14, 14, 256)  0           batch_normalization_88[0][0]     
__________________________________________________________________________________________________
conv2d_91 (Conv2D)              (None, 14, 14, 256)  590080      activation_83[0][0]              
__________________________________________________________________________________________________
batch_normalization_89 (BatchNo (None, 14, 14, 256)  1024        conv2d_91[0][0]                  
__________________________________________________________________________________________________
activation_84 (Activation)      (None, 14, 14, 256)  0           batch_normalization_89[0][0]     
__________________________________________________________________________________________________
conv2d_92 (Conv2D)              (None, 14, 14, 1024) 263168      activation_84[0][0]              
__________________________________________________________________________________________________
batch_normalization_90 (BatchNo (None, 14, 14, 1024) 4096        conv2d_92[0][0]                  
__________________________________________________________________________________________________
add_27 (Add)                    (None, 14, 14, 1024) 0           batch_normalization_90[0][0]     
                                                                 activation_82[0][0]              
__________________________________________________________________________________________________
activation_85 (Activation)      (None, 14, 14, 1024) 0           add_27[0][0]                     
__________________________________________________________________________________________________
conv2d_93 (Conv2D)              (None, 14, 14, 256)  262400      activation_85[0][0]              
__________________________________________________________________________________________________
batch_normalization_91 (BatchNo (None, 14, 14, 256)  1024        conv2d_93[0][0]                  
__________________________________________________________________________________________________
activation_86 (Activation)      (None, 14, 14, 256)  0           batch_normalization_91[0][0]     
__________________________________________________________________________________________________
conv2d_94 (Conv2D)              (None, 14, 14, 256)  590080      activation_86[0][0]              
__________________________________________________________________________________________________
batch_normalization_92 (BatchNo (None, 14, 14, 256)  1024        conv2d_94[0][0]                  
__________________________________________________________________________________________________
activation_87 (Activation)      (None, 14, 14, 256)  0           batch_normalization_92[0][0]     
__________________________________________________________________________________________________
conv2d_95 (Conv2D)              (None, 14, 14, 1024) 263168      activation_87[0][0]              
__________________________________________________________________________________________________
batch_normalization_93 (BatchNo (None, 14, 14, 1024) 4096        conv2d_95[0][0]                  
__________________________________________________________________________________________________
add_28 (Add)                    (None, 14, 14, 1024) 0           batch_normalization_93[0][0]     
                                                                 activation_85[0][0]              
__________________________________________________________________________________________________
activation_88 (Activation)      (None, 14, 14, 1024) 0           add_28[0][0]                     
__________________________________________________________________________________________________
conv2d_96 (Conv2D)              (None, 7, 7, 512)    524800      activation_88[0][0]              
__________________________________________________________________________________________________
batch_normalization_94 (BatchNo (None, 7, 7, 512)    2048        conv2d_96[0][0]                  
__________________________________________________________________________________________________
activation_89 (Activation)      (None, 7, 7, 512)    0           batch_normalization_94[0][0]     
__________________________________________________________________________________________________
conv2d_97 (Conv2D)              (None, 7, 7, 512)    2359808     activation_89[0][0]              
__________________________________________________________________________________________________
batch_normalization_95 (BatchNo (None, 7, 7, 512)    2048        conv2d_97[0][0]                  
__________________________________________________________________________________________________
activation_90 (Activation)      (None, 7, 7, 512)    0           batch_normalization_95[0][0]     
__________________________________________________________________________________________________
conv2d_98 (Conv2D)              (None, 7, 7, 2048)   1050624     activation_90[0][0]              
__________________________________________________________________________________________________
conv2d_99 (Conv2D)              (None, 7, 7, 2048)   2099200     activation_88[0][0]              
__________________________________________________________________________________________________
batch_normalization_96 (BatchNo (None, 7, 7, 2048)   8192        conv2d_98[0][0]                  
__________________________________________________________________________________________________
batch_normalization_97 (BatchNo (None, 7, 7, 2048)   8192        conv2d_99[0][0]                  
__________________________________________________________________________________________________
add_29 (Add)                    (None, 7, 7, 2048)   0           batch_normalization_96[0][0]     
                                                                 batch_normalization_97[0][0]     
__________________________________________________________________________________________________
activation_91 (Activation)      (None, 7, 7, 2048)   0           add_29[0][0]                     
__________________________________________________________________________________________________
conv2d_100 (Conv2D)             (None, 7, 7, 512)    1049088     activation_91[0][0]              
__________________________________________________________________________________________________
batch_normalization_98 (BatchNo (None, 7, 7, 512)    2048        conv2d_100[0][0]                 
__________________________________________________________________________________________________
activation_92 (Activation)      (None, 7, 7, 512)    0           batch_normalization_98[0][0]     
__________________________________________________________________________________________________
conv2d_101 (Conv2D)             (None, 7, 7, 512)    2359808     activation_92[0][0]              
__________________________________________________________________________________________________
batch_normalization_99 (BatchNo (None, 7, 7, 512)    2048        conv2d_101[0][0]                 
__________________________________________________________________________________________________
activation_93 (Activation)      (None, 7, 7, 512)    0           batch_normalization_99[0][0]     
__________________________________________________________________________________________________
conv2d_102 (Conv2D)             (None, 7, 7, 2048)   1050624     activation_93[0][0]              
__________________________________________________________________________________________________
batch_normalization_100 (BatchN (None, 7, 7, 2048)   8192        conv2d_102[0][0]                 
__________________________________________________________________________________________________
add_30 (Add)                    (None, 7, 7, 2048)   0           batch_normalization_100[0][0]    
                                                                 activation_91[0][0]              
__________________________________________________________________________________________________
activation_94 (Activation)      (None, 7, 7, 2048)   0           add_30[0][0]                     
__________________________________________________________________________________________________
conv2d_103 (Conv2D)             (None, 7, 7, 512)    1049088     activation_94[0][0]              
__________________________________________________________________________________________________
batch_normalization_101 (BatchN (None, 7, 7, 512)    2048        conv2d_103[0][0]                 
__________________________________________________________________________________________________
activation_95 (Activation)      (None, 7, 7, 512)    0           batch_normalization_101[0][0]    
__________________________________________________________________________________________________
conv2d_104 (Conv2D)             (None, 7, 7, 512)    2359808     activation_95[0][0]              
__________________________________________________________________________________________________
batch_normalization_102 (BatchN (None, 7, 7, 512)    2048        conv2d_104[0][0]                 
__________________________________________________________________________________________________
activation_96 (Activation)      (None, 7, 7, 512)    0           batch_normalization_102[0][0]    
__________________________________________________________________________________________________
conv2d_105 (Conv2D)             (None, 7, 7, 2048)   1050624     activation_96[0][0]              
__________________________________________________________________________________________________
batch_normalization_103 (BatchN (None, 7, 7, 2048)   8192        conv2d_105[0][0]                 
__________________________________________________________________________________________________
add_31 (Add)                    (None, 7, 7, 2048)   0           batch_normalization_103[0][0]    
                                                                 activation_94[0][0]              
__________________________________________________________________________________________________
activation_97 (Activation)      (None, 7, 7, 2048)   0           add_31[0][0]                     
__________________________________________________________________________________________________
avg_pool (GlobalAveragePooling2 (None, 2048)         0           activation_97[0][0]              
__________________________________________________________________________________________________
fc1000 (Dense)                  (None, 1000)         2049000     avg_pool[0][0]                   
==================================================================================================
Total params: 25,636,712
Trainable params: 25,583,592
Non-trainable params: 53,120
```
