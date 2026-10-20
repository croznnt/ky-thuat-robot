# Tổng quan kho mã nguồn cho học tập và nghiên cứu kỹ thuật robot

Tài liệu này giúp chọn công cụ theo bài toán, từ học động học đến mô phỏng và thực nghiệm trên robot. Các liên kết trỏ đến kho của nhóm phát triển. Ngày đối chiếu thông tin: 20/10/2026. Đây là bản tuyển chọn theo nhu cầu học tập và nghiên cứu, không phải xếp hạng hiệu năng.

Thông tin về vai trò dự án được đối chiếu với mô tả và tài liệu tại các repo được dẫn. Các đề tài, cách ghép công cụ và lộ trình bên dưới là đề xuất của tài liệu này, không phải kết quả thực nghiệm đã thực hiện. Chưa cài đặt hay chạy các dự án được liệt kê trên máy hiện tại.

## 1. Chọn hướng bắt đầu

1. **Học mô hình tay máy:** bắt đầu bằng trang robot 3 bậc tự do trong repo này, sau đó dùng Modern Robotics và Robotics Toolbox for Python để đối chiếu FK, IK, Jacobian và động lực học.
2. **Điều khiển có mô hình:** dùng Pinocchio hoặc Drake cho tính toán, kết hợp một môi trường vật lý như MuJoCo để đánh giá bộ điều khiển.
3. **Lập kế hoạch thao tác:** dùng MoveIt 2; khi thực thi cần thêm hệ điều khiển và driver tương thích với robot.
4. **Học từ trình diễn:** xem LeRobot hoặc robomimic; dùng Diffusion Policy để nghiên cứu một phương pháp chính sách cụ thể.
5. **Học tăng cường và chuyển sang thực:** xem Isaac Lab hoặc ManiSkill; chọn theo robot, tác vụ và tài nguyên tính toán đã có.
6. **Robot di động:** học thuật toán bằng PythonRobotics, nghiên cứu định vị bằng ORB-SLAM3 hoặc RTAB-Map, rồi xây hệ điều hướng bằng Nav2.
7. **Điều khiển bằng hình ảnh và ngôn ngữ:** xem OpenVLA sau khi đã có quy trình thu dữ liệu, đánh giá chính sách và giao tiếp phần cứng.

## 2. Động học, động lực học và nền tảng toán

### Các repo phù hợp

1. [NxRLab/ModernRobotics](https://github.com/NxRLab/ModernRobotics): thư viện đi kèm giáo trình Modern Robotics, phù hợp học phép biến đổi, lý thuyết vít, động học và điều khiển. Dự án tự nêu mục tiêu dễ đọc và phục vụ giáo dục, không tối ưu cho hiệu suất hoặc độ vững khi dùng như phần mềm sản phẩm.
2. [petercorke/robotics-toolbox-python](https://github.com/petercorke/robotics-toolbox-python): công cụ Python cho mô hình, tính toán và trực quan hóa robot. Phù hợp so sánh mô hình DH với các phép tính FK, IK và quỹ đạo.
3. [AtsushiSakai/PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics): mã mẫu và tài liệu về thuật toán robot. Phù hợp đọc từng thuật toán và quan sát mô phỏng, nhất là các bài toán robot di động và lập kế hoạch.
4. [stack-of-tasks/pinocchio](https://github.com/stack-of-tasks/pinocchio): thư viện tính toán động lực học vật rắn và đạo hàm giải tích. Phù hợp làm phần tính toán cho tối ưu hóa, điều khiển và nhận dạng mô hình; cần ghép với môi trường mô phỏng hoặc phần cứng để tạo thí nghiệm hoàn chỉnh.
5. [RobotLocomotion/drake](https://github.com/RobotLocomotion/drake): nền tảng thiết kế và kiểm chứng robot dựa trên mô hình. Phù hợp nghiên cứu kết hợp mô hình đa vật, tối ưu hóa và điều khiển.

### Đề tài đề xuất

**So sánh IK hình học, IK số và IK có ràng buộc.** Dùng cùng chiều dài khâu, hệ tọa độ và tập điểm đích; tách điểm nằm trong vùng làm việc, điểm gần kỳ dị và điểm không tới được. Đo sai số vị trí theo mm, tỷ lệ tìm được nghiệm, số vòng lặp, thời gian giải và mức thay đổi góc giữa hai điểm liên tiếp. Khi tăng lên robot có điều khiển hướng, bổ sung sai số hướng theo radian.

**Điều khiển bám quỹ đạo có tải thay đổi.** Dùng mô hình động lực học để so sánh bộ điều khiển cơ sở với phương pháp có bù mô hình. Báo cáo sai số RMS theo từng khớp, mômen cực đại và ảnh hưởng của sai lệch khối lượng. Không dùng riêng hình hoạt ảnh để kết luận chất lượng điều khiển.

### Liên hệ với repo hiện tại

Trang hiện tại cung cấp FK, IK hình học, ma trận biến đổi, DH chuẩn và cảnh báo chạm nền theo hình học. Chưa có mô phỏng lực tiếp xúc, động lực học, vòng điều khiển thời gian thực hoặc driver phần cứng. Bước mở rộng gần nhất là xuất mô hình cùng bộ điểm kiểm tra sang Python để so sánh kết quả với thư viện ngoài.

## 3. Lập kế hoạch và thao tác tay máy

1. [moveit/moveit2](https://github.com/moveit/moveit2): nền tảng thao tác và lập kế hoạch chuyển động trong ROS 2. Phù hợp xây thí nghiệm tránh vật cản và thực thi quỹ đạo qua hệ điều khiển đã cấu hình.
2. [ros-controls/ros2_control](https://github.com/ros-controls/ros2_control): khung điều khiển cho ROS 2. Vai trò là tổ chức giao diện phần cứng, trạng thái và bộ điều khiển; đây không phải bộ lập kế hoạch đường đi.

**Đề tài đề xuất:** so sánh các cấu hình bộ lập kế hoạch trên cùng robot và cảnh vật cản. Đo tỷ lệ lập kế hoạch thành công, thời gian lập kế hoạch, độ dài đường đi và khoảng cách nhỏ nhất tới vật cản. Đánh giá riêng quỹ đạo đã gán thời gian bằng thời gian thực thi và giới hạn vận tốc, gia tốc. Đường đi hình học và quỹ đạo có thời gian là hai đầu ra khác nhau.

**Chuỗi triển khai đề xuất:** mô hình URDF và cấu hình khớp → MoveIt 2 → bộ điều khiển quỹ đạo → giao diện phần cứng hoặc driver → robot. Chiều phản hồi đưa trạng thái khớp từ robot trở lại hệ thống. Khả năng ghép nối phụ thuộc từng driver, loại giao diện lệnh và phiên bản ROS 2; không mặc định các repo tương thích ngay khi cài cùng nhau.

## 4. Mô phỏng vật lý và tiếp xúc

1. [google-deepmind/mujoco](https://github.com/google-deepmind/mujoco): mô phỏng động lực học đa khớp có tiếp xúc. Phù hợp dựng các bài toán điều khiển, thao tác và tương tác vật lý.
2. [bulletphysics/bullet3](https://github.com/bulletphysics/bullet3): bộ công cụ mô phỏng vật lý và phát hiện va chạm; hệ sinh thái có PyBullet cho lập trình Python. Phù hợp thử nghiệm vật rắn, va chạm và các tác vụ robot có tiếp xúc.
3. [isaac-sim/IsaacLab](https://github.com/isaac-sim/IsaacLab): khung nghiên cứu robot học với hỗ trợ mô phỏng và kết xuất. Phù hợp các quy trình huấn luyện và đánh giá chính sách robot; cần kiểm tra yêu cầu phần cứng, backend và bản phát hành trong tài liệu của dự án.
4. [mani-skill/ManiSkill](https://github.com/mani-skill/ManiSkill): môi trường mô phỏng và bộ bài toán đánh giá kỹ năng thao tác, có khả năng mô phỏng song song trên GPU. Phù hợp nghiên cứu thuật toán học cho tác vụ thao tác.

**Đề tài đề xuất:** ảnh hưởng của ma sát, khối lượng và bước thời gian đến tác vụ gắp vật. Chọn trước các điều kiện thử, đo tỷ lệ thành công, độ trượt và độ biến thiên kết quả qua nhiều lần chạy. Khi so sánh hai môi trường, phải đối chiếu đơn vị, mô hình khớp, luật tiếp xúc và bộ giải; cùng hình dạng hiển thị chưa đảm bảo cùng bài toán vật lý.

**Ranh giới với trang web hiện tại:** cảnh báo vật thể xuyên nền chỉ là kiểm tra hình học. Để mô phỏng phản lực nền, trượt hoặc vật bị đẩy, cần mô hình tiếp xúc và bộ giải vật lý.

## 5. Học từ trình diễn và dữ liệu robot

1. [huggingface/lerobot](https://github.com/huggingface/lerobot): hệ sinh thái học robot từ dữ liệu, có các quy trình liên quan đến dữ liệu, mô hình và phần cứng được hỗ trợ. Phù hợp xây chu trình thu trình diễn, huấn luyện và đánh giá trên robot tương thích.
2. [ARISE-Initiative/robomimic](https://github.com/ARISE-Initiative/robomimic): khung học robot từ trình diễn. Phù hợp thí nghiệm có kiểm soát về tập dữ liệu, biểu diễn quan sát và thuật toán học bắt chước.
3. [real-stanford/diffusion_policy](https://github.com/real-stanford/diffusion_policy): mã nghiên cứu Diffusion Policy cho chính sách điều khiển từ quan sát thị giác. Phù hợp tái lập phương pháp và so sánh với chính sách cơ sở, cần theo đúng quy trình dữ liệu và môi trường của dự án.

**Đề tài đề xuất:** so sánh chính sách cơ sở với Diffusion Policy khi số trình diễn thay đổi. Chia dữ liệu theo phiên thu hoặc điều kiện cảnh, tránh đưa các khung hình gần nhau của cùng lần chạy vào cả tập huấn luyện và kiểm tra. Đo tỷ lệ hoàn thành tác vụ, thời gian tác vụ, độ trễ suy luận và số lần cần người can thiệp.

**Điều kiện chạy thật:** dữ liệu huấn luyện và đầu ra chính sách phải thống nhất hệ tọa độ, đơn vị, tần số, chuẩn hóa, thứ tự khớp và quy ước cơ cấu kẹp. Cần có lớp chuyển đầu ra chính sách thành lệnh mà driver robot chấp nhận. Việc một repo có ví dụ phần cứng không có nghĩa nó hỗ trợ mọi tay máy.

## 6. Học tăng cường và chuyển từ mô phỏng sang thực

[Isaac Lab](https://github.com/isaac-sim/IsaacLab) và [ManiSkill](https://github.com/mani-skill/ManiSkill) phù hợp xem xét ở hướng này. [MuJoCo](https://github.com/google-deepmind/mujoco) là lựa chọn khác khi cần xây bài toán riêng và tự lựa chọn thư viện huấn luyện. Môi trường mô phỏng, thuật toán học và driver robot là các thành phần cần được chọn riêng theo thí nghiệm.

**Đề tài đề xuất:** đánh giá chính sách có và không ngẫu nhiên hóa tham số mô phỏng. Thay đổi có kiểm soát ma sát, khối lượng, trễ điều khiển và nhiễu quan sát. Dành một tập điều kiện ngoài tập huấn luyện để đo khả năng tổng quát hóa. Báo cáo số bước tương tác, thời gian huấn luyện, số hạt giống ngẫu nhiên và tỷ lệ thành công.

**Chuyển sang thực:** đối chiếu phạm vi lệnh, chu kỳ điều khiển, giới hạn khớp và phân phối quan sát trước khi thử trên robot. Kết quả tốt trong mô phỏng chỉ hỗ trợ kết luận cho mô hình và điều kiện mô phỏng đó; bằng chứng chuyển sang thực phải đến từ thí nghiệm phần cứng có ghi nhận điều kiện thử.

## 7. Thị giác, SLAM và robot di động

1. [UZ-SLAMLab/ORB_SLAM3](https://github.com/UZ-SLAMLab/ORB_SLAM3): thư viện SLAM thị giác và thị giác kết hợp quán tính. Phù hợp nghiên cứu định vị, ảnh hưởng hiệu chuẩn và đặc điểm chuyển động camera.
2. [introlab/rtabmap](https://github.com/introlab/rtabmap): thư viện và ứng dụng RTAB-Map cho SLAM và xây bản đồ. Chọn cấu hình cảm biến và tích hợp theo tài liệu của dự án.
3. [ros-navigation/navigation2](https://github.com/ros-navigation/navigation2): hệ điều hướng robot trong ROS 2. Phù hợp xây và đánh giá hành vi đi tới mục tiêu khi đã có mô hình robot, dữ liệu cảm biến, hệ biến đổi tọa độ và nguồn định vị.
4. [PythonRobotics](https://github.com/AtsushiSakai/PythonRobotics): điểm khởi đầu gọn hơn để hiểu thuật toán trước khi tích hợp một hệ ROS 2 đầy đủ.

**Đề tài đề xuất:** đánh giá định vị trong môi trường ít đặc trưng hoặc thay đổi ánh sáng. Đo ATE và RPE khi có dữ liệu chuẩn tham chiếu, tỷ lệ mất bám và thời gian xử lý. Với điều hướng, đo thêm tỷ lệ tới đích, va chạm và thời gian hành trình. Thành công điều hướng không thay thế phép đo sai số định vị.

**Mở rộng cho tay máy:** có thể dùng camera để xác định vị trí mục tiêu, nhưng cần thêm nhận biết vật, ước lượng tư thế và hiệu chuẩn quan hệ camera với robot. SLAM tự nó không giải quyết đầy đủ bài toán gắp vật.

## 8. Mô hình thị giác, ngôn ngữ và hành động

[openvla/openvla](https://github.com/openvla/openvla) cung cấp mã và tài liệu cho mô hình VLA phục vụ thao tác robot. Đây là hướng phù hợp khi nghiên cứu quan hệ giữa ảnh, chỉ dẫn ngôn ngữ và hành động, sau khi đã có hạ tầng dữ liệu và đánh giá.

**Đề tài đề xuất:** đánh giá mô hình sau tinh chỉnh trên vật thể và cách diễn đạt chỉ dẫn chưa có trong tập huấn luyện. Tách trường hợp thay đổi ngôn ngữ khỏi thay đổi hình học cảnh để xác định nguồn suy giảm kết quả. Đo tỷ lệ thành công theo nhóm tác vụ và độ trễ suy luận trên phần cứng thực tế.

README của OpenVLA có quy trình đánh giá mô phỏng và ví dụ triển khai phần cứng cụ thể. Cần đọc đúng cấu hình đang dùng, nhất là chuẩn hóa hành động, xử lý ảnh và dữ liệu tinh chỉnh. Không suy ra khả năng chạy trên tay máy bất kỳ từ một checkpoint có sẵn.

## 9. Driver và thực nghiệm trên robot thật

1. [UniversalRobots/Universal_Robots_ROS2_Driver](https://github.com/UniversalRobots/Universal_Robots_ROS2_Driver): driver ROS 2 cho robot Universal Robots thuộc các dòng được dự án hỗ trợ. Đây là lớp giao tiếp robot, không thay thế bộ lập kế hoạch hoặc quy trình cấu hình của nhà sản xuất.
2. [frankarobotics/franka_ros2](https://github.com/frankarobotics/franka_ros2): tích hợp ROS 2 cho robot nghiên cứu Franka. Cần chọn đúng model robot, phần mềm điều khiển và nhánh tương thích.
3. [ros2_control](https://github.com/ros-controls/ros2_control): khung chung để tổ chức phần điều khiển; robot tự chế thường cần viết giao diện phần cứng cho thiết bị của mình.

**Đề tài đề xuất:** so sánh quỹ đạo đặt và quỹ đạo phản hồi khi thay đổi tải hoặc tốc độ. Ghi thời gian, vị trí đặt, vị trí đo và trạng thái bộ điều khiển; đo sai số bám, trễ và độ lặp lại. Xác minh loại giao diện lệnh mà robot cung cấp trước khi chọn đề tài điều khiển mômen, vì không phải robot nào cũng cho phép lệnh mômen trực tiếp.

Với thí nghiệm phần cứng, bắt đầu bằng đọc trạng thái, kiểm tra quy ước khớp và chạy quỹ đạo nhỏ trong vùng trống. Giới hạn vận tốc và cơ chế dừng phải được thực hiện ở hệ điều khiển phù hợp với robot. Cảnh báo trên trình duyệt của repo này chưa phải chức năng bảo vệ phần cứng.

## 10. Các tổ hợp đề tài có thể triển khai

### A. Đồ án động học và nhận dạng mô hình

**Câu hỏi:** sai số kích thước khâu ảnh hưởng thế nào đến vị trí đầu công tác?

**Công cụ:** repo hiện tại, Robotics Toolbox for Python; bổ sung Pinocchio nếu cần mô hình tổng quát và đạo hàm.

**Đầu ra:** tập cấu hình chuẩn, mã đối chiếu DH với FK hình học, mô hình nhiễu kích thước và báo cáo sai số vị trí. Nếu có robot thật, thêm tập đo độc lập để kiểm tra mô hình sau hiệu chỉnh.

### B. Tránh vật cản cho tay máy

**Câu hỏi:** cấu hình lập kế hoạch nào phù hợp với cảnh hẹp và giới hạn khớp đã chọn?

**Công cụ:** MoveIt 2, mô hình robot và ros2_control hoặc driver tương thích khi thực thi.

**Đầu ra:** bộ cảnh cố định, tham số bộ lập kế hoạch, kết quả nhiều lần chạy và log thực thi. Bước đầu có thể hoàn thành bằng mô phỏng trước khi dùng phần cứng.

### C. Gắp vật từ trình diễn

**Câu hỏi:** chất lượng và độ đa dạng dữ liệu tác động thế nào đến tỷ lệ thành công?

**Công cụ:** LeRobot hoặc robomimic; chọn Diffusion Policy nếu tập trung vào phương pháp này.

**Đầu ra:** quy trình thu dữ liệu, cách chia tập kiểm tra, chính sách cơ sở và báo cáo theo điều kiện cảnh. Cần xác định trước tay máy, camera và giao diện lệnh để chọn nền tảng phù hợp.

### D. Chính sách điều khiển chịu sai lệch mô hình

**Câu hỏi:** ngẫu nhiên hóa tham số giúp đến mức nào khi mô hình và thực tế khác nhau?

**Công cụ:** Isaac Lab, ManiSkill hoặc MuJoCo, cùng thuật toán huấn luyện tương thích.

**Đầu ra:** chính sách cơ sở, miền tham số huấn luyện, tập đánh giá ngoài phân phối và phép đo trên robot nếu có. Không đặt tên kết quả là chuyển sang thực khi chỉ thử ở môi trường mô phỏng thứ hai.

### E. Robot di động định vị và đi tới mục tiêu

**Câu hỏi:** độ ổn định định vị ảnh hưởng thế nào đến khả năng hoàn thành hành trình?

**Công cụ:** ORB-SLAM3 hoặc RTAB-Map cho phần định vị phù hợp cảm biến, Nav2 cho điều hướng.

**Đầu ra:** dữ liệu cảm biến, mô hình biến đổi tọa độ, quỹ đạo chuẩn tham chiếu nếu có và log hành trình. Tách đánh giá SLAM khỏi đánh giá bộ lập kế hoạch điều hướng.

## 11. Cách lựa chọn và tái lập thí nghiệm

1. Chốt bài toán và đầu ra đo được trước khi chọn repo. Với robot thật, chốt model phần cứng và giao diện điều khiển trước.
2. Đọc README, hướng dẫn cài đặt, giấy phép và nhánh phát hành của từng dự án. Ghi commit đã dùng; số sao và tên dự án không chứng minh khả năng tương thích.
3. Chạy ví dụ gốc và lưu cấu hình thành công trước khi đổi thuật toán. Phân biệt lỗi môi trường cài đặt với lỗi phương pháp.
4. Dùng cùng dữ liệu, đơn vị, hệ tọa độ, điều kiện khởi tạo và tiêu chí thành công khi so sánh. Báo cáo tài nguyên CPU hoặc GPU, seed, số lần thử và các lần thất bại.
5. Với mô hình học, kiểm tra riêng giấy phép mã nguồn, dữ liệu và trọng số. Với mô phỏng, kiểm tra quyền sử dụng các thành phần phụ thuộc và tài sản robot.
6. Khi chuyển sang robot thật, ghi rõ phần nào đã kiểm chứng trên phần cứng và phần nào chỉ có kết quả mô phỏng.

## 12. Nguồn và phạm vi cập nhật

Tài liệu dẫn trực tiếp 20 repo khác nhau tại các mục trên. Mô tả dự án và đường dẫn chủ sở hữu đã được đối chiếu qua GitHub tại ngày ghi đầu tài liệu; README của MoveIt 2, ros2_control, LeRobot, Isaac Lab, Diffusion Policy và OpenVLA được đọc thêm để đối chiếu phạm vi sử dụng. Không cố định phiên bản ROS 2, CUDA, GPU hoặc Python trong overview này vì các yêu cầu phụ thuộc bản phát hành và môi trường của từng dự án.

Khi bắt đầu đề tài, cần tạo riêng hồ sơ môi trường và danh sách commit của những repo thực sự sử dụng. Các liên kết trong overview là nguồn tiếp tục tra cứu, không phải cam kết mọi dự án đã được tích hợp với trang mô phỏng hiện tại.
