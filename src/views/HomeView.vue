<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input type="text" v-model="searchQuery" @input="getSearchResults" placeholder="ðæç´¢åå¸" class="py-2 px-1 w-full bg-transparent border-b
       focus:border-weather-secondary 
       focus:outline-none
       focus:shadow-[0px_1px_0_0_#ffffff]" />
      <ul v-if="searchResults"
      class="absolute bg-weather-secondary text-white
      w-full shadow-md py-2 px-1 top-[66px]">
        <p v-if="searchError">
          å¦è±,æå¡å¨å¥½åæç¹é®é¢,åè¯è¯?
        </p>
        <p v-if="!searchError && searchResults.length === 0">
          å¦è±,ä½ æç´¢çå°ç¹å¥½åä¸å­å¨
        </p>
        <template v-else>
          <li v-for="searchResult in searchResults"
          :key="searchResult.id"
          @click="previewCity(searchResult)"
          class="py-2 cursor-pointer">
            {{searchResult.text}}({{searchResult.place_name}})
          </li>
        </template>
      </ul>
    </div>

    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList/>
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>


<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import CityList from '../components/CityList.vue';
import CityCardSkeleton from '../components/CityCardSkeleton.vue';

const router = useRouter();
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxApiKey = 'pk.eyJ1IjoiZm94aXJpcyIsImEiOiJjbDg3ZmNhYnExNGp2M3dxcjdrbTJkb2UyIn0.yAgmkhjHL-AUNVbuIzTUAw';

// æç´¢æ¡å±ç¤ºç»æ
const searchResults = ref(null);
const searchError = ref(null);

// æç´¢åå¸å½æ°
const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  // 300msè¶æ¶æ¶é´ è®¾ç½®åæ­¥
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== '') {
      try {
        // å»¶è¿ç­å¾
        const res = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxApiKey}&types=place&types=locality&language=zh-Hans&worldview=cn`
        );
        searchResults.value = res.data.features;
      } catch {
        searchError.value = true
      }
      return;
    }
    searchResults.value = null;
  }, 300);
};

// è·³è½¬è³åå¸è§å¾é¡µ
const previewCity = (searchResult) => {
  // console.log(searchResult);
  const place = searchResult.text;
  const place_name = searchResult.place_name;
  router.push({
    name: 'cityView',
    params: {
      place: place,
      place_name: place_name,
    },
    query: {
      // ç»åº¦
      lon: searchResult.geometry.coordinates[0],
      // çº¬åº¦
      lat: searchResult.geometry.coordinates[1],
      preview: true,
    },
  });
};
</script>