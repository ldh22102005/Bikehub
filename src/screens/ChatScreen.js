import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const FAQ_DATA = [
  {
    category: '🛒 Mua hàng & Sản phẩm',
    questions: [
      { q: 'Cửa hàng có những loại xe đạp nào?', a: 'Bike World hiện có các dòng xe: Xe đạp địa hình (Mountain Bike), Xe đua (Road Bike), Xe đạp gấp (Folding Bike), và Xe đạp trẻ em. Bạn có thể xem chi tiết ở mục "Sản phẩm" nhé!' },
      { q: 'Xe đạp phù hợp với chiều cao là loại nào?', a: 'Thông thường:\n- Dưới 1m50: Chọn size XS/S hoặc xe trẻ em\n- 1m50 - 1m65: Chọn size S/M\n- 1m65 - 1m75: Chọn size M/L\n- Trên 1m75: Chọn size L/XL\nBạn có thể đến cửa hàng để nhân viên đo đạc chính xác hơn!' },
      { q: 'Xe đạp nào phù hợp cho người mới bắt đầu?', a: 'Đối với người mới, dòng Xe đạp địa hình (Mountain Bike) hoặc Xe đạp đường phố (City Bike) là dễ làm quen nhất vì tư thế ngồi thoải mái và dễ điều khiển.' },
      { q: 'Giá xe đạp dao động từ bao nhiêu?', a: 'Giá xe tại Bike World dao động từ $420 (dành cho xe trẻ em) đến hơn $3,200 cho các dòng xe đua cao cấp chuyên nghiệp.' },
      { q: 'Cửa hàng có xe đạp điện không?', a: 'Hiện tại Bike World đang tập trung chuyên sâu vào các dòng xe đạp thể thao cơ học. Các mẫu xe đạp điện (E-bike) dự kiến sẽ được ra mắt vào quý sau.' },
    ]
  },
  {
    category: '🚚 Mua online & Giao hàng',
    questions: [
      { q: 'Cửa hàng có giao hàng tận nơi không?', a: 'Có! Bike World giao hàng tận nơi trên toàn quốc. Đặc biệt miễn phí giao hàng cho các đơn hàng từ $1,000 trở lên.' },
      { q: 'Thời gian giao hàng mất bao lâu?', a: 'Khu vực nội thành TP.HCM/Hà Nội sẽ nhận hàng trong 1-2 ngày. Các tỉnh thành khác sẽ mất từ 3-5 ngày làm việc.' },
      { q: 'Tôi có thể đặt trực tuyến rồi đến lấy hàng không?', a: 'Hoàn toàn được! Bạn có thể chọn "Nhận tại cửa hàng" khi đặt hàng. Cửa hàng sẽ lắp ráp sẵn và giữ xe cho bạn trong vòng 3 ngày.' },
      { q: 'Chính sách đổi trả như thế nào?', a: 'Bạn có thể đổi trả xe miễn phí trong vòng 7 ngày đầu nếu có lỗi từ nhà sản xuất. Xe đổi trả phải còn nguyên vẹn, đầy đủ phụ kiện và chưa qua sử dụng nhiều.' },
    ]
  },
  {
    category: '📍 Thông tin cửa hàng',
    questions: [
      { q: 'Cửa hàng mở mấy giờ?', a: 'Bike World mở cửa từ 8:00 Sáng đến 21:00 Tối tất cả các ngày trong tuần (kể cả Chủ Nhật và các ngày Lễ).' },
      { q: 'Địa chỉ cửa hàng ở đâu?', a: 'Cửa hàng trung tâm của chúng tôi nằm tại: 123 Đường Điện Biên Phủ, Quận 1, TP. Hồ Chí Minh.' },
      { q: 'Có thể thử xe trước khi mua không?', a: 'Rất hoan nghênh! Bạn có thể đến trực tiếp cửa hàng để chạy thử xe thoải mái trên đường test chuyên dụng trước khi đưa ra quyết định mua nhé.' },
      { q: 'Cửa hàng có hỗ trợ bảo hành không?', a: 'Tất cả khung xe được bảo hành chính hãng 5 năm, phụ tùng bảo hành 1 năm. Chúng tôi cũng hỗ trợ bảo dưỡng định kỳ miễn phí trong 6 tháng đầu tiên!' },
    ]
  }
];

const ChatScreen = ({ onBack, isDarkMode }) => {
  // === 1. KHỞI TẠO STATE TIN NHẮN BOT ===
  const [messages, setMessages] = useState([
    { id: '1', text: 'Chào bạn! Mình là trợ lý ảo của Bike World. Mình có thể giúp gì cho bạn hôm nay?', sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = isDarkMode ? '#1E293B' : '#FFF';
  const textMain = isDarkMode ? '#F8FAFC' : '#1e293b';
  const border = isDarkMode ? '#334155' : '#F1F5F9';

  // === 2. XỬ LÝ KHI NGƯỜI DÙNG BẤM HỎI ===
  const handleAskQuestion = (question, answer) => {
    // Thêm câu hỏi của user
    const userMsg = { id: Date.now().toString(), text: question, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    
    // Giả lập bot đang "gõ chữ"
    setIsTyping(true);
    setTimeout(() => {
      const botMsg = { id: (Date.now() + 1).toString(), text: answer, sender: 'bot' };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600); // Trễ 0.6s cho cảm giác thật
  };

  // === 3. TỰ ĐỘNG CUỘN XUỐNG KHI CÓ TIN MỚI ===
  useEffect(() => {
    // Tự động cuộn xuống tin nhắn mới nhất
    if (flatListRef.current) {
      setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  // === 4. RENDER GIAO DIỆN TIN NHẮN ===
  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Ionicons name="headset" size={16} color="#FFF" />
          </View>
        )}
        <View style={[styles.msgBubble, isUser ? styles.msgUser : [styles.msgBot, { backgroundColor: cardBg, borderColor: border }]]}>
          <Text style={[styles.msgText, isUser ? styles.msgTextUser : [styles.msgTextBot, { color: textMain }]]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  // === 5. RENDER KHUNG CHAT TỔNG ===
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={onBack} style={{ padding: 5 }}>
          <Feather name="arrow-left" size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: textMain }]}>Hỗ trợ trực tuyến</Text>
          <Text style={styles.headerStatus}>• Đang hoạt động</Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatArea}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => 
          isTyping ? (
            <View style={[styles.msgRow, styles.msgRowBot]}>
              <View style={styles.botAvatar}><Ionicons name="headset" size={16} color="#FFF" /></View>
              <View style={[styles.msgBubble, styles.msgBot, { backgroundColor: cardBg, borderColor: border }]}><Text style={[styles.msgTextBot, { color: textMain }]}>Đang trả lời...</Text></View>
            </View>
          ) : null
        }
      />

      <View style={[styles.suggestionArea, { backgroundColor: cardBg, borderTopColor: border }]}>
        <Text style={styles.suggestionTitle}>Chọn câu hỏi để nhận giải đáp:</Text>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {FAQ_DATA.map((group, gIdx) => (
            <View key={gIdx} style={styles.faqGroup}>
              <Text style={[styles.groupTitle, { color: textMain }]}>{group.category}</Text>
              {group.questions.map((item, qIdx) => (
                <TouchableOpacity 
                  key={qIdx} 
                  style={[styles.questionBtn, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]} 
                  onPress={() => handleAskQuestion(item.q, item.a)}
                  disabled={isTyping}
                >
                  <Text style={styles.questionText}>{item.q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // BỐ CỤC CHÍNH
  // ==========================================
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },

  // ==========================================
  // HEADER THÔNG TIN CHAT
  // ==========================================
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 12, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9', 
    elevation: 2 
  },
  headerInfo: { 
    flex: 1, 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1e293b' 
  },
  headerStatus: { 
    fontSize: 12, 
    color: '#22c55e', 
    fontWeight: '600', 
    marginTop: 2 
  },
  
  // ==========================================
  // KHU VỰC HIỂN THỊ TIN NHẮN
  // ==========================================
  chatArea: { 
    padding: 15, 
    paddingBottom: 20 
  },
  msgRow: { 
    flexDirection: 'row', 
    marginBottom: 15, 
    alignItems: 'flex-end' 
  },
  msgRowUser: { 
    justifyContent: 'flex-end' 
  },
  msgRowBot: { 
    justifyContent: 'flex-start' 
  },
  botAvatar: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor: '#10B981', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 8 
  },
  msgBubble: { 
    maxWidth: '75%', 
    paddingHorizontal: 15, 
    paddingVertical: 12, 
    borderRadius: 18 
  },
  msgBot: { 
    backgroundColor: '#FFF', 
    borderBottomLeftRadius: 4, 
    borderWidth: 1, 
    borderColor: '#F1F5F9' 
  },
  msgUser: { 
    backgroundColor: '#0ea5e9', 
    borderBottomRightRadius: 4 
  },
  msgText: { 
    fontSize: 14, 
    lineHeight: 20 
  },
  msgTextBot: { 
    color: '#334155' 
  },
  msgTextUser: { 
    color: '#FFF' 
  },

  // ==========================================
  // KHU VỰC GỢI Ý CÂU HỎI (FAQ) DƯỚI CÙNG
  // ==========================================
  suggestionArea: {
    height: '45%',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 15,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  suggestionTitle: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#64748B', 
    marginBottom: 10 
  },
  faqGroup: { 
    marginBottom: 15 
  },
  groupTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    marginBottom: 8, 
    marginTop: 5 
  },
  questionBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  questionText: { 
    fontSize: 13, 
    color: '#0ea5e9', 
    fontWeight: '500' 
  }
});

export default ChatScreen;