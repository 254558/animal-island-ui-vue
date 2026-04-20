<script setup lang="ts">
defineProps<{
    rows: Array<{
        prop: string;
        desc: string;
        type: string;
        defaultVal?: string;
    }>;
}>();
</script>

<template>
    <div class="api-table">
        <div class="api-label">API</div>
        <div class="api-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>属性</th>
                        <th>说明</th>
                        <th>类型</th>
                        <th>默认值</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.prop">
                        <td class="prop">{{ row.prop }}</td>
                        <td>{{ row.desc }}</td>
                        <td class="type">{{ row.type }}</td>
                        <td class="default">{{ row.defaultVal ?? '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.api-table {
    margin-top: 24px;
}

.api-label {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 10px 10px 0 0;
    background: #3d3028;
    color: #e7e4e0;
    font-size: 14px;
    font-weight: 600;
}

.api-wrapper {
    overflow: auto;
    border: 1px solid #3d3028;
    border-radius: 0 10px 10px 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: #2b2118;
    font-size: 13px;
}

th {
    padding: 10px 16px;
    background: #352a20;
    color: #e7e4e0;
    text-align: left;
    white-space: nowrap;
}

td {
    padding: 8px 16px;
    border-bottom: 1px solid #3d3028;
    color: #d4b896;
    vertical-align: top;
}

tbody tr:last-child td {
    border-bottom: none;
}

.prop {
    color: #f0a870;
    font-weight: 600;
    white-space: nowrap;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace !important;
}

.type {
    color: #a8d4a0;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace !important;
}

.default {
    color: #8ab8e0;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace !important;
}
</style>
