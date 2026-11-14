// Tag names (the Notion options) in each language.
// New options you add in Notion are translated automatically by the build
// (see scripts/translate.mjs, saved in data/cache/tags.json). Anything listed
// here wins over the automatic version, so fix a bad one by adding it here.
import auto from '../../data/cache/tags.json';

// [ko, zh, th, vi]
const T = {
  // Type
  Restaurant: ['식당', '餐厅', 'ร้านอาหาร', 'Nhà hàng'],
  Izakaya: ['이자카야', '居酒屋', 'อิซากายะ', 'Izakaya'],
  'Café': ['카페', '咖啡馆', 'คาเฟ่', 'Cà phê'],
  Bar: ['바', '酒吧', 'บาร์', 'Bar'],
  'Bakery & Sweets': ['빵·디저트', '面包甜点', 'เบเกอรี่และขนม', 'Bánh & đồ ngọt'],
  Sightseeing: ['관광', '观光', 'ที่เที่ยว', 'Tham quan'],
  Activity: ['체험', '体验', 'กิจกรรม', 'Trải nghiệm'],
  Shop: ['쇼핑', '购物', 'ช้อปปิ้ง', 'Mua sắm'],
  Stay: ['숙소', '住宿', 'ที่พัก', 'Lưu trú'],
  // Speciality
  Japanese: ['일식', '日料', 'อาหารญี่ปุ่น', 'Món Nhật'],
  Ramen: ['라멘', '拉面', 'ราเมน', 'Ramen'],
  'Soba & Udon': ['소바·우동', '荞麦面·乌冬', 'โซบะและอุด้ง', 'Soba & udon'],
  Sushi: ['스시', '寿司', 'ซูชิ', 'Sushi'],
  Seafood: ['해산물', '海鲜', 'ซีฟู้ด', 'Hải sản'],
  Jingisukan: ['징기스칸', '成吉思汗烤肉', 'จิงกิสข่าน', 'Jingisukan'],
  Yakiniku: ['야키니쿠', '烤肉', 'ยากินิกุ', 'Yakiniku'],
  Yakitori: ['야키토리', '烤鸡串', 'ยากิโทริ', 'Yakitori'],
  'Soup curry': ['수프카레', '汤咖喱', 'ซุปแกงกะหรี่', 'Súp cà ri'],
  Curry: ['카레', '咖喱', 'แกงกะหรี่', 'Cà ri'],
  Takoyaki: ['타코야키', '章鱼烧', 'ทาโกะยากิ', 'Takoyaki'],
  Chinese: ['중화요리', '中华料理', 'อาหารจีน', 'Món Hoa'],
  Korean: ['한식', '韩餐', 'อาหารเกาหลี', 'Món Hàn'],
  Asian: ['아시아 요리', '亚洲菜', 'อาหารเอเชีย', 'Món Á'],
  Western: ['양식', '西餐', 'อาหารตะวันตก', 'Món Âu'],
  Italian: ['이탈리안', '意大利菜', 'อิตาเลียน', 'Món Ý'],
  French: ['프렌치', '法餐', 'อาหารฝรั่งเศส', 'Món Pháp'],
  Spanish: ['스페인 요리', '西班牙菜', 'อาหารสเปน', 'Món Tây Ban Nha'],
  Burgers: ['버거', '汉堡', 'เบอร์เกอร์', 'Burger'],
  Sandwiches: ['샌드위치', '三明治', 'แซนด์วิช', 'Bánh mì kẹp'],
  Brunch: ['브런치', '早午餐', 'บรันช์', 'Brunch'],
  Coffee: ['커피', '咖啡', 'กาแฟ', 'Cà phê'],
  Tea: ['차', '茶', 'ชา', 'Trà'],
  Bread: ['빵', '面包', 'ขนมปัง', 'Bánh mì'],
  Cakes: ['케이크', '蛋糕', 'เค้ก', 'Bánh ngọt'],
  Parfait: ['파르페', '芭菲', 'พาร์เฟต์', 'Parfait'],
  'Ice cream': ['아이스크림', '冰淇淋', 'ไอศกรีม', 'Kem'],
  Wine: ['와인', '葡萄酒', 'ไวน์', 'Rượu vang'],
  Beer: ['맥주', '啤酒', 'เบียร์', 'Bia'],
  Sake: ['사케', '日本酒', 'สาเก', 'Rượu sake'],
  Cocktails: ['칵테일', '鸡尾酒', 'ค็อกเทล', 'Cocktail'],
  Whisky: ['위스키', '威士忌', 'วิสกี้', 'Whisky'],
  Pub: ['펍', '英式酒吧', 'ผับ', 'Pub'],
  Hotel: ['호텔', '酒店', 'โรงแรม', 'Khách sạn'],
  Guesthouse: ['게스트하우스', '民宿', 'เกสต์เฮาส์', 'Nhà nghỉ'],
  Ryokan: ['료칸', '日式旅馆', 'เรียวกัง', 'Ryokan'],
  // Area
  'Sapporo Station': ['삿포로역', '札幌站', 'สถานีซัปโปโร', 'Ga Sapporo'],
  Odori: ['오도리', '大通', 'โอโดริ', 'Odori'],
  Susukino: ['스스키노', '薄野', 'ซูซูกิโนะ', 'Susukino'],
  Tanukikoji: ['다누키코지', '狸小路', 'ทานุกิโคจิ', 'Tanukikoji'],
  Maruyama: ['마루야마', '圆山', 'มารุยามะ', 'Maruyama'],
  'Nakajima Park': ['나카지마 공원', '中岛公园', 'สวนนากาจิมะ', 'Công viên Nakajima'],
  Moiwa: ['모이와', '藻岩', 'โมอิวะ', 'Moiwa'],
  Kikusui: ['기쿠스이', '菊水', 'คิคุซุย', 'Kikusui'],
  // Good for
  Families: ['가족', '亲子', 'ครอบครัว', 'Gia đình'],
  Solo: ['혼자', '一个人', 'มาคนเดียว', 'Đi một mình'],
  'Small Group': ['소규모', '三五好友', 'กลุ่มเล็ก', 'Nhóm nhỏ'],
  Groups: ['단체', '多人聚会', 'มาเป็นกลุ่ม', 'Đi đông người'],
  Dates: ['데이트', '约会', 'เดต', 'Hẹn hò'],
  'Rainy day': ['비 오는 날', '下雨天', 'วันฝนตก', 'Ngày mưa'],
  Winter: ['겨울', '冬天', 'หน้าหนาว', 'Mùa đông'],
  // Practical
  'Serves food': ['식사 가능', '有餐食', 'มีอาหาร', 'Có đồ ăn'],
  'English menu': ['영어 메뉴', '有英文菜单', 'มีเมนูภาษาอังกฤษ', 'Có menu tiếng Anh'],
  'Cash only': ['현금만', '仅收现金', 'เงินสดเท่านั้น', 'Chỉ tiền mặt'],
  'Open late': ['늦게까지 영업', '营业到深夜', 'เปิดดึก', 'Mở khuya'],
  'Wheelchair accessible': ['휠체어 가능', '轮椅可进', 'รถเข็นเข้าได้', 'Xe lăn vào được'],
  'Free entry': ['무료 입장', '免费入场', 'เข้าฟรี', 'Vào cửa miễn phí'],
  // Dietary
  'Fully vegan': ['완전 비건', '纯素', 'วีแกนทั้งร้าน', 'Thuần chay'],
  'Vegan options': ['비건 메뉴 있음', '有纯素选择', 'มีเมนูวีแกน', 'Có món thuần chay'],
  'Vegetarian options': ['채식 메뉴 있음', '有素食选择', 'มีเมนูมังสวิรัติ', 'Có món chay'],
  'Halal-friendly': ['할랄 친화', '清真友好', 'เป็นมิตรกับฮาลาล', 'Thân thiện Halal'],
  'Gluten-free options': ['글루텐 프리 메뉴', '有无麸质选择', 'มีเมนูปลอดกลูเตน', 'Có món không gluten'],
  // Reservation
  Required: ['예약 필수', '必须预约', 'ต้องจอง', 'Bắt buộc đặt chỗ'],
  Recommended: ['예약 권장', '建议预约', 'แนะนำให้จอง', 'Nên đặt trước'],
  'Walk-in': ['예약 없이 OK', '无需预约', 'ไม่ต้องจอง', 'Không cần đặt'],
};
const EN = { Required: 'Book ahead', Recommended: 'Booking recommended', 'Walk-in': 'Walk in' };
const IDX = { ko: 0, zh: 1, th: 2, vi: 3 };

export function tag(value, lang) {
  if (!value) return '';
  if (lang === 'en') return EN[value] || value;
  return T[value]?.[IDX[lang]] || auto[value]?.[lang] || EN[value] || value;
}
export const KNOWN_TAGS = new Set(Object.keys(T));
