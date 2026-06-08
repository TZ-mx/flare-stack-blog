# 《无线感知前沿》维护规则

## 定位

《无线感知前沿》是一篇面向无线感知、物联网感知、智能感知和泛在计算研究者的长期维护型技术博客。

目标不是做泛泛新闻汇总，而是持续跟踪 WiFi 感知、RF 感知、毫米波雷达、UWB、声学/射频多模态感知、跨环境泛化、跨域迁移、低功耗部署、LLM 与无线感知结合等方向的高信号论文、系统、数据集、开源项目和产业进展。

## 强制规则

- 不写开场白、问候语或结尾总结。
- 不使用表格排版。
- 不生成“今日观察”“深度要点”“一句话结论”等模块。
- 不写泛泛升华和过度包装。
- 不使用“震撼”“颠覆性”“史诗级”等商业宣传词。
- 不为了凑数量加入低价值内容。
- 没有高信号内容时，可以不更新对应日期或月份。

## 长度

- 单日默认 3 到 6 条。
- 月度或年度回填按月份写，不按天展开。
- 月度章节默认 4 到 8 条，控制在约 1 页阅读量。
- 每条 1 句话，必要时最多 2 句话。
- 更关注论文和技术进展，少写泛商业新闻。

## 标签

严格使用以下标签：

- `[Paper]`：学术论文、技术报告、预印本，只写题目、链接和一句话介绍。
- `[Project]`：课题组项目、系统原型、公开 demo、数据集或 benchmark。
- `[Repo]`：开源代码、模型、工具箱、数据处理管线。
- `[Lab]`：课题组、研究组、企业研究团队的重要进展。
- `[Engineering]`：系统实现、部署经验、硬件平台、跨环境泛化、数据采集和工程评测。
- `[Industry]`：企业产品、标准、芯片、雷达模组、WiFi 标准或产业落地。

## 输出格式

当天更新：

```markdown
# 无线感知前沿

#### YYYY.MM.DD

- **[标签]** [标题](链接地址)：一句话客观技术描述。

---
```

历史月份或全年回填：

```markdown
#### YYYY.MM

- **[标签]** [标题](链接地址)：一句话客观技术描述。

---
```

多日期或多月份内容按时间倒序排列，最新内容在最上方。

## 论文条目

论文只需要：

- 论文题目。
- 论文链接。
- 一句话介绍论文提出了什么方法、系统、数据集、实验结论或落地价值。

论文不需要展开作者列表、机构、BibTeX、引用格式、摘要翻译或长篇评价。

## 论文来源优先级

1. 顶会/顶刊与其开放论文页：ACM MobiCom、SenSys、UbiComp/IMWUT、NSDI、SIGCOMM、INFOCOM、IPSN、IEEE TMC、IEEE IoT Journal、IEEE TSP、IEEE JSAC、IEEE T-ITS、IEEE Sensors Journal 等。
2. 重要课题组主页、publication 页面和 project 页面。
3. Google Scholar 中能检索到、引用增长明显或讨论度高的论文。
4. GitHub、Hugging Face、Papers with Code、OpenReview、会议官方程序中有开源、数据集或高讨论度的论文。
5. arXiv 只作为入口，不作为唯一筛选依据；普通 arXiv 条目如果没有核心课题组背景、社区热度或明确技术价值，不写入正文。

Sci-Hub 不作为自动来源、不作为正文引用来源，也不用于下载论文全文。

## 重点方向

- WiFi CSI 感知、802.11bf、WiFi sensing 标准化。
- RF sensing、device-free sensing、backscatter sensing。
- 毫米波雷达、FMCW radar、MIMO radar、4D radar。
- UWB、RFID、声学/射频融合、无线-视觉多模态感知。
- 跨环境、跨域、跨设备、跨用户泛化。
- 自监督、少样本、域适应、联邦学习、边缘部署。
- LLM / VLM / Agent 与无线感知结合。
- 人车识别、姿态估计、手势识别、生命体征、室内定位、行为识别、智能交通、智慧健康。

## 重点关注课题组和团队

- 北京大学张大庆团队：泛在计算、行为感知、WiFi sensing、城市计算。
- MIT CSAIL / Dina Katabi：无线感知、RF-based health monitoring、Emerald、WiFi/RF through-wall sensing。
- MIT Signal Kinetics / Fadel Adib：无线网络、RF sensing、机器人与海洋/水下感知。
- Stanford Arbabian Lab：毫米波、雷达感知、无线与医学感知硬件系统。
- HKUST / NUS / Tsinghua / SJTU / USTC / Zhejiang University 等泛在计算、物联网和无线感知团队。
- 企业与产业团队：Google Soli、Texas Instruments mmWave、Infineon radar、Vayyar、Acconeer、Origin Wireless、Cognitive Systems、NVIDIA automotive radar。

## 默认保留内容

- 重要课题组的新论文、新系统、新数据集。
- 顶会顶刊无线感知论文。
- 开源 WiFi CSI、毫米波雷达、UWB、RFID、传感器融合工具。
- 与跨环境泛化、跨域迁移、低功耗部署、真实场景落地有关的工作。
- LLM、VLM、foundation model、agent 与无线感知结合的工作。
- 802.11bf、雷达芯片、毫米波传感器、产业落地和标准化进展。

## 默认排除内容

- 泛泛物联网新闻。
- 没有技术细节的产品宣传。
- 只停留在概念层的智能家居新闻。
- 来源不清、不可验证或没有链接的信息。
- 普通 arXiv 条目且没有核心团队背景、社区热度或明确技术价值的论文。
