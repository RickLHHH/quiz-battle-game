import type { Question } from './types.js';

// 影视娱乐类题目 (50题)
export const entertainmentQuestions: Question[] = [
  // 简单难度 (30题)
  { id: 'e001', category: 'ent', question: '电影《泰坦尼克号》的导演是谁？', options: ['史蒂文·斯皮尔伯格', '詹姆斯·卡梅隆', '克里斯托弗·诺兰', '昆汀·塔伦蒂诺'], correctAnswer: 1, difficulty: 1 },
  { id: 'e002', category: 'ent', question: '《复仇者联盟》中钢铁侠的扮演者是？', options: ['克里斯·埃文斯', '克里斯·海姆斯沃斯', '小罗伯特·唐尼', '马克·鲁法洛'], correctAnswer: 2, difficulty: 1 },
  { id: 'e003', category: 'ent', question: '动画电影《千与千寻》的导演是？', options: ['新海诚', '宫崎骏', '押井守', '大友克洋'], correctAnswer: 1, difficulty: 1 },
  { id: 'e004', category: 'ent', question: '《哈利·波特》系列电影中，饰演哈利·波特的演员是？', options: ['鲁伯特·格林特', '汤姆·费尔顿', '丹尼尔·雷德克里夫', '马修·刘易斯'], correctAnswer: 2, difficulty: 1 },
  { id: 'e005', category: 'ent', question: '电影《阿凡达》的故事发生在哪里？', options: ['火星', '潘多拉星球', '月球', '木星'], correctAnswer: 1, difficulty: 1 },
  { id: 'e006', category: 'ent', question: '《速度与激情》系列中，多米尼克的扮演者是？', options: ['保罗·沃克', '范·迪塞尔', '道恩·强森', '杰森·斯坦森'], correctAnswer: 1, difficulty: 1 },
  { id: 'e007', category: 'ent', question: '动画电影《冰雪奇缘》中，艾莎的妹妹叫什么名字？', options: ['安娜', '艾拉', '索菲亚', '茉莉'], correctAnswer: 0, difficulty: 1 },
  { id: 'e008', category: 'ent', question: '电影《教父》讲述的是哪个家族的故事？', options: ['科里昂家族', '甘比诺家族', '卢切斯家族', '博南诺家族'], correctAnswer: 0, difficulty: 1 },
  { id: 'e009', category: 'ent', question: '《星球大战》中反派达斯·维达是谁的爸爸？', options: ['卢克', '汉·索罗', '欧比旺', '尤达'], correctAnswer: 0, difficulty: 1 },
  { id: 'e010', category: 'ent', question: '电影《肖申克的救赎》中，安迪在监狱里待了多久？', options: ['10年', '19年', '25年', '30年'], correctAnswer: 1, difficulty: 1 },
  { id: 'e011', category: 'ent', question: '《疯狂动物城》中，主角朱迪是什么动物？', options: ['狐狸', '兔子', '狮子', '树懒'], correctAnswer: 1, difficulty: 1 },
  { id: 'e012', category: 'ent', question: '电影《盗梦空间》的导演是？', options: ['克里斯托弗·诺兰', '大卫·芬奇', '马丁·斯科塞斯', '雷德利·斯科特'], correctAnswer: 0, difficulty: 1 },
  { id: 'e013', category: 'ent', question: '《加勒比海盗》系列中，杰克船长的扮演者是谁？', options: ['奥兰多·布鲁姆', '约翰尼·德普', '杰弗里·拉什', '凯拉·奈特莉'], correctAnswer: 1, difficulty: 1 },
  { id: 'e014', category: 'ent', question: '电影《霸王别姬》中，程蝶衣的扮演者是？', options: ['张国荣', '张丰毅', '葛优', '陈道明'], correctAnswer: 0, difficulty: 1 },
  { id: 'e015', category: 'ent', question: '《流浪地球》改编自哪位作家的作品？', options: ['刘慈欣', '王晋康', '何夕', '韩松'], correctAnswer: 0, difficulty: 1 },
  { id: 'e016', category: 'ent', question: '电影《大话西游》中，至尊宝的经典台词"曾经有一份真诚的爱情..."是对谁说的？', options: ['白晶晶', '紫霞仙子', '铁扇公主', '春三十娘'], correctAnswer: 1, difficulty: 1 },
  { id: 'e017', category: 'ent', question: '《功夫熊猫》中，主角阿宝是什么动物？', options: ['老虎', '猴子', '熊猫', '鹤'], correctAnswer: 2, difficulty: 1 },
  { id: 'e018', category: 'ent', question: '电影《黑客帝国》中，主角尼奥吃下的是什么颜色的药丸？', options: ['红色', '蓝色', '绿色', '黄色'], correctAnswer: 0, difficulty: 1 },
  { id: 'e019', category: 'ent', question: '《指环王》系列中，魔戒最终在哪里被销毁？', options: ['瑞文戴尔', '魔多末日火山', '刚铎', '夏尔'], correctAnswer: 1, difficulty: 1 },
  { id: 'e020', category: 'ent', question: '电影《无间道》中，梁朝伟饰演的角色是？', options: ['刘建明', '陈永仁', '黄志诚', '韩琛'], correctAnswer: 1, difficulty: 1 },
  { id: 'e021', category: 'ent', question: '《玩具总动员》中，伍迪是什么玩具？', options: ['太空骑警', '牛仔警长', '恐龙', '猪存钱罐'], correctAnswer: 1, difficulty: 1 },
  { id: 'e022', category: 'ent', question: '电影《让子弹飞》的导演是？', options: ['冯小刚', '陈凯歌', '姜文', '张艺谋'], correctAnswer: 2, difficulty: 1 },
  { id: 'e023', category: 'ent', question: '《狮子王》中，辛巴的叔叔叫什么名字？', options: ['木法沙', '刀疤', '拉飞奇', '丁满'], correctAnswer: 1, difficulty: 1 },
  { id: 'e024', category: 'ent', question: '电影《让子弹飞》中，"站着把钱挣了"是谁说的？', options: ['张麻子', '黄四郎', '汤师爷', '花姐'], correctAnswer: 0, difficulty: 1 },
  { id: 'e025', category: 'ent', question: '《哈利·波特》中，霍格沃茨的校长叫什么名字？', options: ['斯内普', '邓布利多', '麦格', '海格'], correctAnswer: 1, difficulty: 1 },
  { id: 'e026', category: 'ent', question: '电影《海上钢琴师》中，1900最终是否下船？', options: ['是', '否', '没有明确说明', '只在梦里下船'], correctAnswer: 1, difficulty: 1 },
  { id: 'e027', category: 'ent', question: '《喜羊羊与灰太狼》中，灰太狼的经典台词是什么？', options: ['我一定会回来的！', '可恶的喜羊羊！', '老婆，我饿了', '小肥羊，我来了'], correctAnswer: 0, difficulty: 1 },
  { id: 'e028', category: 'ent', question: '电影《少年的你》中，周冬雨饰演的角色叫？', options: ['陈念', '魏莱', '胡小蝶', '郑易'], correctAnswer: 0, difficulty: 1 },
  { id: 'e029', category: 'ent', question: '《哪吒之魔童降世》中，哪吒的口头禅是？', options: ['我命由我不由天', '是魔是仙，我自己说了算', '若命运不公，就和它斗到底', '以上都是'], correctAnswer: 3, difficulty: 1 },
  { id: 'e030', category: 'ent', question: '电影《你好，李焕英》的导演和主演是？', options: ['贾玲', '沈腾', '张小斐', '陈赫'], correctAnswer: 0, difficulty: 1 },
  // 中等难度 (15题)
  { id: 'e031', category: 'ent', question: '电影《楚门的世界》中，楚门最终是通过什么方式离开摄影棚的？', options: ['乘船', '飞机', '走路', '开车'], correctAnswer: 0, difficulty: 2 },
  { id: 'e032', category: 'ent', question: '《星际穿越》中，库珀进入黑洞后到达了什么地方？', options: ['五维空间', '平行宇宙', '未来地球', '虫洞'], correctAnswer: 0, difficulty: 2 },
  { id: 'e033', category: 'ent', question: '电影《让子弹飞》的故事背景发生在什么年代？', options: ['清朝', '民国', '抗战时期', '解放战争时期'], correctAnswer: 1, difficulty: 2 },
  { id: 'e034', category: 'ent', question: '《这个杀手不太冷》中，莱昂的职业是？', options: ['警察', '杀手', '特工', '保镖'], correctAnswer: 1, difficulty: 2 },
  { id: 'e035', category: 'ent', question: '电影《星际穿越》的导演是？', options: ['诺兰', '斯皮尔伯格', '卡梅隆', '斯科特'], correctAnswer: 0, difficulty: 2 },
  { id: 'e036', category: 'ent', question: '《霸王别姬》获得了哪届戛纳电影节金棕榈奖？', options: ['1992年', '1993年', '1994年', '1995年'], correctAnswer: 1, difficulty: 2 },
  { id: 'e037', category: 'ent', question: '电影《沉默的羔羊》中，汉尼拔的职业是？', options: ['医生', '律师', '心理学家', '教授'], correctAnswer: 2, difficulty: 2 },
  { id: 'e038', category: 'ent', question: '《疯狂动物城》中，树懒闪电在哪家机构工作？', options: ['警察局', '车管所', '法院', '银行'], correctAnswer: 1, difficulty: 2 },
  { id: 'e039', category: 'ent', question: '电影《盗梦空间》中，柯布的妻子叫什么名字？', options: ['阿里阿德涅', '梅尔', '萨托', '伊姆斯'], correctAnswer: 1, difficulty: 2 },
  { id: 'e040', category: 'ent', question: '《功夫》中，周星驰饰演的角色最终学会了什么武功？', options: ['降龙十八掌', '如来神掌', '六脉神剑', '太极拳'], correctAnswer: 1, difficulty: 2 },
  { id: 'e041', category: 'ent', question: '电影《寄生虫》的导演奉俊昊是哪国人？', options: ['日本', '韩国', '中国', '泰国'], correctAnswer: 1, difficulty: 2 },
  { id: 'e042', category: 'ent', question: '《肖申克的救赎》中，安迪越狱时使用的工具是什么？', options: ['锤子', '勺子', '石头', '螺丝刀'], correctAnswer: 0, difficulty: 2 },
  { id: 'e043', category: 'ent', question: '电影《蝙蝠侠：黑暗骑士》中，小丑的扮演者是谁？', options: ['杰克·尼科尔森', '杰瑞德·莱托', '希斯·莱杰', '华金·菲尼克斯'], correctAnswer: 2, difficulty: 2 },
  { id: 'e044', category: 'ent', question: '《寻梦环游记》中，主角米格尔热爱什么音乐？', options: ['摇滚', '爵士', '古典吉他', '流行音乐'], correctAnswer: 2, difficulty: 2 },
  { id: 'e045', category: 'ent', question: '电影《摔跤吧！爸爸》讲述的是哪个国家的故事？', options: ['中国', '巴基斯坦', '印度', '孟加拉国'], correctAnswer: 2, difficulty: 2 },
  // 困难难度 (5题)
  { id: 'e046', category: 'ent', question: '《公民凯恩》中，"玫瑰花蕾"（Rosebud）实际上是什么？', options: ['初恋情人', '童年雪橇', '庄园名字', '宠物狗'], correctAnswer: 1, difficulty: 3 },
  { id: 'e047', category: 'ent', question: '电影《2001太空漫游》的导演是？', options: ['斯皮尔伯格', '库布里克', '塔可夫斯基', '雷德利·斯科特'], correctAnswer: 1, difficulty: 3 },
  { id: 'e048', category: 'ent', question: '《教父》中，马龙·白兰度饰演的角色叫什么名字？', options: ['迈克尔·科里昂', '维托·科里昂', '桑尼·科里昂', '弗雷多·科里昂'], correctAnswer: 1, difficulty: 3 },
  { id: 'e049', category: 'ent', question: '电影《搏击俱乐部》改编自哪位作家的作品？', options: ['斯蒂芬·金', '恰克·帕拉尼克', '约翰·格里森姆', '丹·布朗'], correctAnswer: 1, difficulty: 3 },
  { id: 'e050', category: 'ent', question: '《布达佩斯大饭店》的导演韦斯·安德森以什么风格著称？', options: ['写实主义', '对称构图与独特色彩', '手持摄影', '黑白影像'], correctAnswer: 1, difficulty: 3 },
];

// 生活常识类题目 (50题)
export const lifeQuestions: Question[] = [
  // 简单难度 (30题)
  { id: 'l001', category: 'life', question: '人体最大的器官是什么？', options: ['心脏', '肝脏', '皮肤', '大脑'], correctAnswer: 2, difficulty: 1 },
  { id: 'l002', category: 'life', question: '一天中什么时候空气最新鲜？', options: ['早晨', '傍晚', '中午', '深夜'], correctAnswer: 1, difficulty: 1 },
  { id: 'l003', category: 'life', question: '人的正常体温大约是多少度？', options: ['35°C', '36°C', '37°C', '38°C'], correctAnswer: 2, difficulty: 1 },
  { id: 'l004', category: 'life', question: '哪种维生素可以促进钙的吸收？', options: ['维生素A', '维生素B', '维生素C', '维生素D'], correctAnswer: 3, difficulty: 1 },
  { id: 'l005', category: 'life', question: '煮熟的鸡蛋在常温下能保存多久？', options: ['1-2天', '3-5天', '一周', '两周'], correctAnswer: 0, difficulty: 1 },
  { id: 'l006', category: 'life', question: '彩虹通常有几种颜色？', options: ['5种', '6种', '7种', '8种'], correctAnswer: 2, difficulty: 1 },
  { id: 'l007', category: 'life', question: '下列哪种食物富含维生素C？', options: ['苹果', '橙子', '香蕉', '西瓜'], correctAnswer: 1, difficulty: 1 },
  { id: 'l008', category: 'life', question: '人有多少颗牙齿（成人完整）？', options: ['28颗', '30颗', '32颗', '34颗'], correctAnswer: 2, difficulty: 1 },
  { id: 'l009', category: 'life', question: '一年中有多少天？', options: ['364天', '365天', '366天', '视情况而定'], correctAnswer: 3, difficulty: 1 },
  { id: 'l010', category: 'life', question: '水在多少摄氏度时沸腾（标准大气压）？', options: ['90°C', '95°C', '100°C', '110°C'], correctAnswer: 2, difficulty: 1 },
  { id: 'l011', category: 'life', question: '人眨眼一次大约需要多长时间？', options: ['0.1秒', '0.3秒', '0.5秒', '1秒'], correctAnswer: 1, difficulty: 1 },
  { id: 'l012', category: 'life', question: '下列哪种水果属于浆果类？', options: ['苹果', '葡萄', '桃子', '梨子'], correctAnswer: 1, difficulty: 1 },
  { id: 'l013', category: 'life', question: '人民币的最大面值是多少？', options: ['50元', '100元', '500元', '1000元'], correctAnswer: 1, difficulty: 1 },
  { id: 'l014', category: 'life', question: '人的血液是什么颜色？', options: ['蓝色', '紫色', '红色', '绿色'], correctAnswer: 2, difficulty: 1 },
  { id: 'l015', category: 'life', question: '感冒时多喝什么有助于康复？', options: ['咖啡', '碳酸饮料', '温水', '冰水'], correctAnswer: 2, difficulty: 1 },
  { id: 'l016', category: 'life', question: '下列哪种动物是哺乳动物？', options: ['蛇', '青蛙', '蝙蝠', '蜥蜴'], correctAnswer: 2, difficulty: 1 },
  { id: 'l017', category: 'life', question: '一天24小时中，时针转多少圈？', options: ['1圈', '2圈', '3圈', '4圈'], correctAnswer: 1, difficulty: 1 },
  { id: 'l018', category: 'life', question: '下列哪种材料是可回收垃圾？', options: ['剩饭剩菜', '废旧电池', '塑料瓶', '卫生纸'], correctAnswer: 2, difficulty: 1 },
  { id: 'l019', category: 'life', question: '人的指纹在什么时期形成？', options: ['出生时', '胎儿期', '婴儿期', '幼儿期'], correctAnswer: 1, difficulty: 1 },
  { id: 'l020', category: 'life', question: '手机充电时应该先插哪一端？', options: ['无所谓', '先插手机', '先插电源', '都可以'], correctAnswer: 2, difficulty: 1 },
  { id: 'l021', category: 'life', question: '下列哪种食物不能放微波炉加热？', options: ['鸡蛋', '牛奶', '面包', '蔬菜'], correctAnswer: 0, difficulty: 1 },
  { id: 'l022', category: 'life', question: '中国手机号码有几位数字？', options: ['10位', '11位', '12位', '13位'], correctAnswer: 1, difficulty: 1 },
  { id: 'l023', category: 'life', question: '下列哪种颜色是暖色调？', options: ['蓝色', '绿色', '紫色', '橙色'], correctAnswer: 3, difficulty: 1 },
  { id: 'l024', category: 'life', question: '人每天大约需要多少小时的睡眠？', options: ['4-5小时', '6-8小时', '9-10小时', '11-12小时'], correctAnswer: 1, difficulty: 1 },
  { id: 'l025', category: 'life', question: '下列哪种食物含蛋白质最高？', options: ['米饭', '鸡蛋', '白菜', '苹果'], correctAnswer: 1, difficulty: 1 },
  { id: 'l026', category: 'life', question: '信用卡背面的签名条应该？', options: ['不签', '随便签', '签持卡人姓名', '画个图案'], correctAnswer: 2, difficulty: 1 },
  { id: 'l027', category: 'life', question: '下列哪种植物可以净化空气？', options: ['仙人掌', '绿萝', '多肉', '以上都可以'], correctAnswer: 3, difficulty: 1 },
  { id: 'l028', category: 'life', question: '人心脏位于身体的哪一侧？', options: ['正中间', '偏左侧', '偏右侧', '腹部'], correctAnswer: 1, difficulty: 1 },
  { id: 'l029', category: 'life', question: '下列哪种茶属于发酵茶？', options: ['绿茶', '白茶', '红茶', '黄茶'], correctAnswer: 2, difficulty: 1 },
  { id: 'l030', category: 'life', question: '电梯里的紧急呼叫按钮是什么颜色？', options: ['红色', '黄色', '绿色', '蓝色'], correctAnswer: 1, difficulty: 1 },
  // 中等难度 (15题)
  { id: 'l031', category: 'life', question: '人体的胃酸主要是什么酸？', options: ['硫酸', '盐酸', '硝酸', '醋酸'], correctAnswer: 1, difficulty: 2 },
  { id: 'l032', category: 'life', question: '为什么面包放久了会变硬？', options: ['淀粉老化', '水分蒸发', '酵母死亡', '氧化反应'], correctAnswer: 0, difficulty: 2 },
  { id: 'l033', category: 'life', question: '黄金的标准纯度"24K"表示含金量多少？', options: ['90%', '95%', '99%', '99.9%'], correctAnswer: 3, difficulty: 2 },
  { id: 'l034', category: 'life', question: '为什么切洋葱会让人流泪？', options: ['辣味刺激', '释放出催泪物质', '气味太冲', '过敏反应'], correctAnswer: 1, difficulty: 2 },
  { id: 'l035', category: 'life', question: 'ISO在相机设置中表示什么？', options: ['快门速度', '光圈大小', '感光度', '白平衡'], correctAnswer: 2, difficulty: 2 },
  { id: 'l036', category: 'life', question: '为什么冰箱冷藏室在上方，冷冻室在下方？', options: ['热空气上升，冷空气下沉', '设计习惯', '方便取用', '节省空间'], correctAnswer: 0, difficulty: 2 },
  { id: 'l037', category: 'life', question: '条形码最前面的2-3位数字代表什么？', options: ['商品类别', '生产国家/地区', '厂家代码', '校验码'], correctAnswer: 1, difficulty: 2 },
  { id: 'l038', category: 'life', question: '为什么高铁站台有安全白线？', options: ['美观', '防止旅客掉落', '列车高速通过时气压差危险', '划分区域'], correctAnswer: 2, difficulty: 2 },
  { id: 'l039', category: 'life', question: '为什么手机屏幕容易沾指纹？', options: ['静电吸附', '油脂附着', '屏幕材质特性', '以上都是'], correctAnswer: 3, difficulty: 2 },
  { id: 'l040', category: 'life', question: '为什么香蕉放冰箱会变黑？', options: ['冻伤', '氧化', '成熟过快', '光照不足'], correctAnswer: 0, difficulty: 2 },
  { id: 'l041', category: 'life', question: '为什么红酒要醒？', options: ['让酒与空气接触释放香气', '过滤杂质', '降温', '增加酒精度'], correctAnswer: 0, difficulty: 2 },
  { id: 'l042', category: 'life', question: '为什么肥皂能去污？', options: ['溶解油脂', '乳化作用', '杀菌消毒', '摩擦清洁'], correctAnswer: 1, difficulty: 2 },
  { id: 'l043', category: 'life', question: '为什么味精加热过度会有苦味？', options: ['变成焦谷氨酸钠', '分解成氨', '氧化变质', '与其他物质反应'], correctAnswer: 0, difficulty: 2 },
  { id: 'l044', category: 'life', question: '为什么牛奶盒是方的，饮料瓶是圆的？', options: ['牛奶需要避光保存', '生产成本不同', '储存方式不同', '以上都是'], correctAnswer: 3, difficulty: 2 },
  { id: 'l045', category: 'life', question: '为什么蜜蜂蜇人后自己会死？', options: ['毒液用尽', '倒刺勾住无法拔出，内脏被拉出', '体力耗尽', '受到反击'], correctAnswer: 1, difficulty: 2 },
  // 困难难度 (5题)
  { id: 'l046', category: 'life', question: '为什么飞机起飞降落时要打开遮光板？', options: ['让乘客欣赏风景', '让眼睛适应光线，方便紧急撤离', '调节机舱温度', '节省电力'], correctAnswer: 1, difficulty: 3 },
  { id: 'l047', category: 'life', question: '为什么打火机的火是黄色的，燃气灶的火是蓝色的？', options: ['燃料不同', '完全燃烧与不充分燃烧', '温度不同', '含氧量不同'], correctAnswer: 1, difficulty: 3 },
  { id: 'l048', category: 'life', question: '为什么罐头食品能长期保存？', options: ['添加防腐剂', '高温灭菌密封', '真空包装', '低温冷藏'], correctAnswer: 1, difficulty: 3 },
  { id: 'l049', category: 'life', question: '为什么牛仔裤后腰有一块皮标？', options: ['品牌标识', '加固裤腰', '历史传承，最初用于区分裤子前后', '装饰作用'], correctAnswer: 2, difficulty: 3 },
  { id: 'l050', category: 'life', question: '为什么银行ATM机的键盘是金属的？', options: ['耐用', '防止静电', '散热快，防止指纹残留被盗取', '防水'], correctAnswer: 2, difficulty: 3 },
];

// 导出所有题目
export const allQuestions: Question[] = [...entertainmentQuestions, ...lifeQuestions];

// 获取随机题目
export function getRandomQuestions(categories: string[], count: number): Question[] {
  const filtered = allQuestions.filter(q => categories.includes(q.category));
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 类别定义
export const categories = [
  { id: 'ent', name: '影视娱乐', icon: '🎬', color: '#e040fb' },
  { id: 'life', name: '生活常识', icon: '🏠', color: '#ffd600' },
];
