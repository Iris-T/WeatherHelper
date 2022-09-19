<template>
    <div class="flex py-6 px-3 bg-weather-secondary rounded-md shadow-md cursor-pointer">
        <div class="flex flex-col flex-1">
            <h2 class="text-3xl"> {{ city.place }} </h2>
            <h3>{{ city.place_name }}</h3>
        </div>
        <div class="flex flex-col gap-2">
            <p class="text-3xl self-end">
                {{ Math.round(FToC(city.weather.main.temp)) }}&#8451;
            </p>
            <div class="flex gap-2">
                <p class="text-xs">
                    <span>
                        气温范围: {{ Math.round(FToC(city.weather.main.temp_max)) }}
                    </span>
                    ~
                    <span>
                        {{ Math.round(FToC(city.weather.main.temp_min)) }}
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    city: {
        type: Object,
        default: () => { },
    },
});

// 温度转换
const FToC = (degree) => {
    return (degree - 32) / 1.8
}
</script>