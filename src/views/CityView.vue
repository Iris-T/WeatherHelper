<template>
    <div>
        <Suspense>
            <AsyncCIty />
            <template #fallback>
                <CityCardSkeleton />
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import AsyncCIty from "../components/AsyncCIty.vue";
import CityCardSkeleton from "../components/CityCardSkeleton.vue";

</script>