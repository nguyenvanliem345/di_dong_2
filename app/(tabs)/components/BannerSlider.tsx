import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    View,
} from "react-native";
import { API_CONFIG } from "../../../apiConfig";

const { width: windowWidth } = Dimensions.get("window");
const IS_WEB = windowWidth > 500;
const APP_WIDTH = IS_WEB ? 414 : windowWidth;

export const BannerSlider = ({ ads }: { ads: any[] }) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // AUTO SLIDE 3 GIÂY
  useEffect(() => {
    if (!ads || ads.length < 2) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1 >= ads.length ? 0 : prev + 1;

        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [ads]);

  return (
    <View style={styles.bannerContainer}>
      <FlatList
        ref={flatListRef}
        data={ads}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}

        /** ⭐ QUAN TRỌNG – FIX KHÔNG CHẠY ⭐ */
        getItemLayout={(_, index) => ({
          length: APP_WIDTH,
          offset: APP_WIDTH * index,
          index,
        })}

        keyExtractor={(item, index) =>
          item?.id?.toString() || index.toString()
        }

        renderItem={({ item }) => (
          <View style={{ width: APP_WIDTH }}>
            <Image
              source={{
                uri: API_CONFIG.IMAGE_URL("slideShows", item.photo),
              }}
              style={styles.bannerImage}
            />
          </View>
        )}

        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / APP_WIDTH
          );
          setCurrentIndex(index);
        }}

        onScrollToIndexFailed={() => {
          flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
          });
        }}
      />

      {/* PAGINATION */}
      <View style={styles.pagination}>
        {ads.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    height: 180,
    marginTop: 10,
  },
  bannerImage: {
    width: APP_WIDTH - 30,
    height: 170,
    borderRadius: 12,
    marginHorizontal: 15,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#C62828",
    width: 15,
  },
});
