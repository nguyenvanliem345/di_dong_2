import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { API_CONFIG } from '../../../apiConfig';

type Props = {
  onSelectCategory: (id: number | null) => void;
};

export const CategoryList = ({ onSelectCategory }: Props) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);

  useEffect(() => {
    fetch(API_CONFIG.CATEGORIES)
      .then(res => res.json())
      .then(data => setCategories(data.content || data))
      .catch(err => console.error('Lỗi lấy danh mục:', err));
  }, []);

  const handlePress = (id: number | null) => {
    const newId = activeCat === id ? null : id;
    setActiveCat(newId);
    onSelectCategory(newId);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
      
      {/* ALL */}
      <TouchableOpacity onPress={() => handlePress(null)} style={{ alignItems: 'center', marginRight: 25 }}>
        <View style={{
          width: 55, height: 55, borderRadius: 15,
          backgroundColor: '#fff',
          justifyContent: 'center', alignItems: 'center',
          borderWidth: activeCat === null ? 2 : 0,
          borderColor: '#FFD700'
        }}>
          <Text style={{ fontSize: 20 }}>🍴</Text>
        </View>
        <Text style={{ color: '#fff', marginTop: 8 }}>Tất cả</Text>
      </TouchableOpacity>

      {categories.map(cat => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => handlePress(cat.id)}
          style={{ alignItems: 'center', marginRight: 25 }}
        >
          <View style={{
            width: 55, height: 55, borderRadius: 15,
            backgroundColor: '#fff',
            borderWidth: activeCat === cat.id ? 2 : 0,
            borderColor: '#FFD700',
            overflow: 'hidden'
          }}>
            <Image
              source={{ uri: API_CONFIG.IMAGE_URL('categories', cat.photo) }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <Text style={{ color: '#fff', marginTop: 8 }}>{cat.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
