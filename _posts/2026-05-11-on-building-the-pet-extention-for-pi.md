---
layout:                     post
title:                      On building the pet extension for Pi
date:                       2026-05-11
mathjax:                    true
comments:                   true
description:                Các suy nghĩ, thinking process và learning về quá trình build Pet extension trên Pi
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Tulip4attoo/media_for_projects/master/pi-pet-image.gif" width="200" alt="Pi Pet demo" />
</p>

Gần đây, mình dùng Pi nhiều và khá mê, vì sự hữu dụng (quan trọng nhất) cao - và sự linh hoạt trong flow, việc thực hiện rất tốt từ mặt triết lý minimal tới thực tế.

Tuần trước, Codex app có launch 1 features mới là pet, trông khá vui. Mình tự nhiên cũng muốn làm 1 cái như thế cho Pi. Ok, làm thôi.

Và đây là Pi pet extension của mình.

<p align="center">
  <video controls playsinline style="width: 100%; max-width: 720px; height: auto;" src="https://raw.githubusercontent.com/Tulip4attoo/media_for_projects/master/pi-pet-0.3.mp4">
    <a href="https://github.com/Tulip4attoo/media_for_projects/blob/master/pi-pet-0.3.mp4">Xem demo video</a>
  </video>
</p>

# Ý tưởng và nhu cầu cụ thể

Mình đã thử pet của Codex, và trong quá trình sử dụng, mình thấy có 1 số feature mình mong muốn ở pet:

+ dễ dàng control bằng chat - cái này vì mình đã mất tương đối thời gian chỉ để tìm cách kích hoạt nó. Và cách đổi pet cũng ko nhanh, suy cho cùng, codex vẫn xây dựng theo phong cách Software 2.0, [not 3.0 như Pi](https://mathstodon.xyz/@tulip4attoo/116554111224410110).
+ là 1 overlay trên màn hình, đóng vài trò giúp người dùng back to session và dùng để monitor 1 số cái trong pi.
+ có 1 số anim khi tương tác, cái này học theo pet
+ có nhiều nhân vật chút, dễ dàng thay đổi, và việc thay đổi nên nhanh chóng, đơn giản.
+ do mình dùng WSL + Windows nên đây là môi trường chính mà mình focus.

# Quá trình thực hiện

## v0.0.1: Xây cầu - kết nối môi trường của 2 OS

Với cá nhân mình, những khó khăn lớn nhất khi thực hiện projetc này là:
+ tìm cách render ra được overlay trên windows, nhưng process cần chạy ở WSL
+ tìm cách sync với Pi process, link với Pi window, và mouse action.

Việc này không hiển nhiên. Làm overlay cho windows thật ra không khó, tuy vậy control từ WSL lại là vấn đề khác. 

Điểm hay ở đây là project phải nối hai môi trường:
 - Linux/WSL: nơi Pi chạy
 - Windows: nơi UI overlay xuất hiện
    - PowerShell/WPF: runtime desktop thực tế

Ở 1 extension khác là `glimpseui` thì nó dùng native webView để render cho mỗi OS, tuy vậy, do chạy trên Wbuntu của WSL và render lên window, điều này không native nên dẫn tới việc điều chỉnh UI cũng như tracking, tương tác với user action (như mouse click, mouse movement) không chính xác và có latency cao.

Tuy vậy, có 1 phương pháp khác là làm IPC bridge để nối 2 môi trường này lại.

Và bước đầu tiên mình thực hiện chính là tìm cách tạo 1 control script để có thể execute từ WSL. Mục tiêu là thực hiện được command này trên terminal của Ubuntu (trên WSL):

```
./pet-bubble.sh start
```

và sẽ show ra 1 text overlay trên màn hình. Ngoài ra, cái overlay ấy có thể tương tác được, bằng việc làm drag/drop nó.

Ở đây, overlay sẽ đảm bảo là giữ connect với pi session:
+ khởi tạo ra khi 1 pi process được gọi
+ link với các process, có thể nhận biết start/finish cho các request, để user nhận ra và tiếp tục các process
+ tự động tắt đi khi pi process ngắt. Cái này không trivial, vì thường mình ctrl + Z để force shutdown process, chứ không phải quit. Nên việc track process này là từ windows, track các process id bên WSL, cũng là track cross platform.

Đây chính là focus chính của [Commit #1](https://github.com/Tulip4attoo/pi-pet/commit/ac304e221f6fdfd858a123541fb6383fa99aff3f) của mình.

> Với bridge cross-environment, protocol càng ngu/càng đơn giản càng tốt.

Mà ở đây là `pet-bubble.sh` không nên làm nhiều logic, chỉ ghi command/state ra file; renderer phía Windows tự xử lý UI.

Một bài học khá rõ ở đây là trong bridge kiểu này, không phải mọi phần đều quan trọng ngang nhau. UI có thể fail nhẹ, usage ring có thể không load, focus window có thể không tìm thấy handle, nhưng `command.json` mà không được ghi ra thì toàn bộ overlay coi như không tồn tại.

Vì vậy `pet-bubble.sh` nên nằm trên critical path nhỏ nhất có thể: nhận status từ Pi, tạo thư mục, ghi `command.json`, rồi thoát. Những việc mang tính cosmetic hoặc dễ fail hơn như tìm foreground window, detect terminal handle, resolve Windows UI state... nên để phía PowerShell manager xử lý, hoặc ít nhất phải là best-effort. Đây là một bài học khá thực tế: trong cross-process/cross-OS integration, phần protocol và command writer cần boring, predictable, và khó hỏng hơn là thông minh.

## v0.1: Pet render, pet install + click back window + usage ring

3 decision chính cho version 0.1 này:

1. Asset ecosystem: dùng Petdex/Codex Pets thay vì tự vẽ pet.
2. Runtime rendering: WPF render sprite sheet, nhẹ hơn Electron.
3. Utility layer: usage ring + focus terminal để pet không chỉ cute mà còn hữu dụng.

Dưới đây mình nói kỹ hơn về quá trình thực hiện.

Tiếp đó, mình cần render pet ra màn hình. Việc này thì khá đơn giản.

Đi kèm đó, cần sử dụng các pet khác. Có 2 sites khá nhiều pet là petdex và codex pets, thì mình có dùng cả 2. Có 1 số bước cần làm như là:

+ viết pipeline download từ link. Cái này hơi mất công chút, có link còn đưa zip và dĩ nhiên ta phải xử lý.
+ chưa kể tới, các sprite sheet trên 2 site này (phần lớn) tạo bởi AI (cũng ko sao), nhưng lưu dưới dạng webp và transparent pixels không được clean lắm, nên ta phải làm 1 bước process ra clean png nữa. Nói thêm về điều này, do Electron app render thì xử lý cái này tiện hơn là WPF. Nhưng mà WPF thì nhẹ hơn, chỉ có 1 script thôi, không phải cả trăm MB cho dung lượng.


Và ở đây, mình đã tạm render anim luôn, về cơ bản có process sprite sheet và mặc định chỉ load idle anim từ sprite sheet, không có các anim khác (và do đó, chỉ có duy nhất 1 state mà thôi).

Vậy là, pet của mình có 1 số command để cài và dùng các pet khác:
```
/pet install luffy
/pet install https://codex-pets.net/#/pets/dario
/pet use einstein
/pet list
/pet current
```

Tới đây về cơ bàn là xong v0.1 rồi. Mình có chọn sẵn Einstein là default pet của mình, trông khá mê. Hồi học CS31 thì phải, mac của giảng viên hình như có stecker này, trông rất vui.

> Pet không chỉ để trang trí, mà là status surface cho Pi sessions.

Tiếp đó, mình add thêm 2 chức năng để phục vụ cho mình, và monitor dễ hơn:
+ usage ring, show usage limit cho 5h và 7d session.
+ click để focus back về cái terminal của pi (thay vì phải Alt+Tab khá mất công)

Về usage ring, mình thấy đây là 1 feature hay cho pet này, vì mình thường xuyên phải check usage để xem switch account hoặc bật fast mode. Cách làm thì không khó, vì OpenAI có endpoint cho query, và mình đã làm ở https://github.com/Tulip4attoo/pi-codex-manager rồi.

Về click để focus back về cái terminal của pi, cái này thì liên quan tới việc check process id mà ta đã làm ở v0.0.1, nên triển khai không khó.

## v0.2: Animation states

Phần này thì thật ra khía cạnh kỹ thuật không khó, công việc chủ yếu gồm:
+ process sprite sheet - lọc anim theo hàng. Cái này làm mình nhớ làm ở Unity.
+ định nghĩa các state để sync animation

Có 1 vấn đề nhỏ là không có document cho các state cụ thể của pet codex, và chính bản thân mình cũng không thích các state review các thứ. Nên mình đã tự define state theo ý muốn bản thân mình. Suy cho cùng, mình mới là user chính (duy nhất) mà.

Cá nhân mình đang để thế này:

```text
Pet/bubble first appears -> waving for one loop, then idle
Active work starts       -> running
Task finishes            -> jumping for one loop, then idle
Idle/ready/background    -> idle
Pet click                -> waving for one loop, then previous/base state
Drag right               -> running-right while dragging/moving right
Drag left                -> running-left while dragging/moving left
Error/failure            -> failed when there is a clear error signal
```

Có thể dễ dàng modify ở `AGENTS.md` của project.

Tuy đơn giản nhưng phần này làm khá mất công, vì định nghĩa state không phải 1 việc thẳng đuột, và nhiều khi nghĩ ra xong state A thì ta lại có edge case, pahir test kỹ trước khi qua state B.

## v0.3: Hoàn thiện để publish

Tới v0.2 thì gần như là xong rồi. v0.3 mình có làm 1 số thứ để hoàn thiện:
+ hỗ trợ việc tạo tool để user có thể request thay đổi ngay từ Pi, thay vì gõ command. Vd chỉ cần gõ: tôi muốn 1 nhân vật từ LoL làm pet, thì Pi có thể tự đi tìm những pet liên quan tới từ khóa LoL (hoặc 1 số keywords khác), sau đó feedback/tự cài. Ta cũng làm cơ chế lazy load để đảm bảo không ảnh hưởng tới context/prompt, chỉ bật ra khi được yêu cầu.
+ search command/tool: để search nhanh hơn, không cần Pi tự search (vẫn ok nhưng hơi mất thời gian_ mà làm tool có sẵn, dựa trên API của site).
+ một số polish khác: persist pet khi update qua github,...
+ hoàn thiện README, làm gif

Cá nhân mình tới đây là coi như tạm xong rồi. Dùng cá nhân thì đủ cho các yêu cầu của mình.

> Với LLM app, context là tài nguyên. Một tool vui như pet management không nên tự động nhét vào mọi conversation.

# Hướng mở rộng

Thật ra, mình thấy hướng mở rộng rõ ràng của Pi Pet là sử dụng được trên Linux thuần và macOS. Mình nghĩ với bộ khung mình làm, làm thêm 1 cái render thì cũng đơn giản. Nhưng không có máy test nên mình cũng lười làm tiếp (btw, có commit cho bên mac ở repo đó). Cá nhân mình nghĩ, làm 1 bản port dễ thôi vì không gặp vấn đề cross platform như mình.

# Tổng kết

Nghiêm túc mà nói, mình khá bất ngờ vì WPF hoàn toàn gần như không cần cài đặt, chỉ 1 vài script nhỏ đã chạy được rồi. Việc làm cross platform cũng ra kết quả trơn tru hơn mình nghĩ.

Rất rất vui và thỏa mãn với kết quả này. Cũng có vài bài học nho nhỏ rút ra sau quá trình làm: từ việc xử lý cross platform, cho tới việc xác định features để làm. Vui nhất là mình thật sự có dùng nó, hehe.

Nếu gom lại thì có 4 bài học chính mình rút ra:

1. Cross-platform không nhất thiết cần framework nặng. Với use case nhỏ, script + native UI có khi lại nhẹ, dễ debug và đủ tốt.
2. Critical path phải đơn giản và reliable. Pet có thể cute, nhưng command writer phải boring và chắc chắn.
3. Pet UX nên playful/simple, không cần phản ánh toàn bộ internal state của agent. Người dùng cần biết working/done/error là chính.
4. Tool cho LLM nên opt-in. Context là tài nguyên, nên một tool vui như pet management không nên tự động chen vào mọi conversation.

Và ngoài ra, mình đang có suy nghĩ về việc quảng bá nó ở 1 số nơi để có thêm người dùng. Tuy vậy, mình vẫn muốn làm xong Mac version (khả năng phải mượn máy để test) trước khi quảng bá thực sự. Mình còn muốn làm Youtube video cho nó nữa, vì vui mà.