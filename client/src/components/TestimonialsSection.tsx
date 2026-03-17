// SkinAI TestimonialsSection — 用户评价区域

const TESTIMONIALS = [
  {
    name: '小雨',
    age: 24,
    location: '上海',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&q=80',
    rating: 5,
    content: '用了 SkinAI 才知道自己是混油皮，之前一直用错产品！分析结果非常详细，推荐的水杨酸精华用了两周，毛孔真的细了很多。',
    highlight: '毛孔细了很多',
  },
  {
    name: '林晓晴',
    age: 29,
    location: '北京',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80',
    rating: 5,
    content: '作为一个护肤小白，SkinAI 给了我非常清晰的护肤步骤和产品推荐。最喜欢它的隐私保护，照片分析完就删除，很放心。',
    highlight: '清晰的护肤指导',
  },
  {
    name: '陈美玲',
    age: 32,
    location: '广州',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&q=80',
    rating: 5,
    content: '分析报告里发现了我有轻微色沉，推荐了烟酰胺产品。用了一个月，朋友说我皮肤变亮了！准确率真的很高，强烈推荐！',
    highlight: '皮肤变亮了',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-16">
          <p className="font-sans-sc text-sm text-[#1C3A2E] tracking-widest uppercase mb-3">
            用户评价
          </p>
          <h2 className="font-serif-sc text-4xl font-bold text-[#1A1A1A] mb-4">
            她们的
            <span className="text-[#1C3A2E]"> 皮肤变化</span>
          </h2>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>

        {/* 评价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, age, location, avatar, rating, content, highlight }) => (
            <div
              key={name}
              className="bg-white rounded-3xl p-6 border border-[#F0EDE8] hover:shadow-xl hover:shadow-[#1C3A2E]/8 transition-all duration-300 card-hover"
            >
              {/* 星级 */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-[#C9956A] text-sm">★</span>
                ))}
              </div>

              {/* 高亮标签 */}
              <div className="inline-block bg-[#E8F0EC] text-[#1C3A2E] font-sans-sc text-xs px-3 py-1 rounded-full mb-3">
                "{highlight}"
              </div>

              {/* 评价内容 */}
              <p className="font-sans-sc text-sm text-[#5A5A5A] leading-relaxed mb-5">
                {content}
              </p>

              {/* 用户信息 */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#F0EDE8]">
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-serif-sc text-sm font-semibold text-[#1A1A1A]">{name}</div>
                  <div className="font-sans-sc text-xs text-[#8A8A8A]">{age}岁 · {location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 数据统计 */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: '500,000+', label: '用户信赖' },
            { number: '98%', label: '用户满意度' },
            { number: '3秒', label: '平均分析时长' },
            { number: '12项', label: '皮肤检测维度' },
          ].map(({ number, label }) => (
            <div key={label} className="text-center p-6 bg-white rounded-2xl border border-[#F0EDE8]">
              <div className="font-serif-sc text-3xl font-bold text-[#1C3A2E] mb-1">{number}</div>
              <div className="font-sans-sc text-sm text-[#8A8A8A]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
