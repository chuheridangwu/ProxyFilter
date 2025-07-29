import yaml from 'js-yaml';

// 内存缓存系统
const CACHE = new Map();
const DEFAULT_CACHE_TTL = 1800;

// 默认模板配置
const DEFAULT_TEMPLATE_YAML = `
mixed-port: 7890
allow-lan: true
bind-address: '*'
mode: rule
log-level: info
external-controller: 127.0.0.1:9090
dns:
  enable: true
  ipv6: false
  default-nameserver:
  - 223.5.5.5
  - 119.29.29.29
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  use-hosts: true
  nameserver:
  - https://doh.pub/dns-query
  - https://dns.alidns.com/dns-query
  fallback:
  - https://doh.dns.sb/dns-query
  - https://dns.cloudflare.com/dns-query
  fallback-filter:
    geoip: true
    ipcidr:
    - 240.0.0.0/4
    - 0.0.0.0/32

proxy-groups:
- name: 手动选择
  type: select
  proxies:
  - 自动选择
  - 负载散列
  - 负载轮询
  - DIRECT
`;

// CORS 头部
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    
    // 获取环境变量
    const env = {
      DEFAULT_URL: process.env.DEFAULT_URL,
      DEFAULT_NAME_FILTER: process.env.DEFAULT_NAME_FILTER,
      DEFAULT_TYPE_FILTER: process.env.DEFAULT_TYPE_FILTER,
      FORCE_NAME_FILTER: process.env.FORCE_NAME_FILTER,
      FORCE_TYPE_FILTER: process.env.FORCE_TYPE_FILTER,
      DEFAULT_SERVER_FILTER: process.env.DEFAULT_SERVER_FILTER,
      FORCE_SERVER_FILTER: process.env.FORCE_SERVER_FILTER,
    };

    // 处理主要逻辑（从原 index.js 复制核心逻辑）
    const result = await handleRequest(url, env);
    
    // 设置响应头
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
    return res.status(200).send(result);
    
  } catch (error) {
    console.error('处理请求时出错:', error);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(500).send(`Error: ${error.message}`);
  }
}

// 将原来的核心处理逻辑移到这里
async function handleRequest(url, env) {
  // 这里复制原 index.js 中的主要处理逻辑
  // ... (保持原有的处理逻辑不变)
}