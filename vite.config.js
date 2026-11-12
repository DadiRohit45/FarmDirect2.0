import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import https from 'node:https'
import dns from 'node:dns'

// Dynamic DNS-over-HTTPS (DoH) resolver to query public Cloudflare/Google DoH standard APIs
// Bypasses local ISP UDP port 53 DNS interception dynamically without hardcoding any IP addresses
async function getSupabaseEdgeIp(hostname) {
  return new Promise((resolve) => {
    https.get(`https://1.1.1.1/dns-query?name=${hostname}`, {
      headers: { 'accept': 'application/dns-json' },
      timeout: 3000
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          const record = json.Answer?.find(x => x.type === 1)
          if (record?.data) {
            resolve(record.data)
            return
          }
        } catch (_) {}
        resolve(null)
      })
    }).on('error', () => resolve(null))
  })
}

// Initialize upstream agent with dynamic DoH resolution for the Supabase host
const supabaseHostname = 'dqvuxqcpvkjmnslxnvrp.supabase.co'
let resolvedEdgeIp = null

// Pre-resolve on server bootstrap
getSupabaseEdgeIp(supabaseHostname).then(ip => {
  resolvedEdgeIp = ip
})

const upstreamAgent = new https.Agent({
  lookup: (hostname, options, callback) => {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    if (hostname === supabaseHostname && resolvedEdgeIp) {
      if (options && options.all) {
        callback(null, [{ address: resolvedEdgeIp, family: 4 }])
      } else {
        callback(null, resolvedEdgeIp, 4)
      }
    } else {
      dns.lookup(hostname, options, callback)
    }
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/dist/**']
    },
    proxy: {
      // Same-origin development proxy: eliminates CORS preflight & routes through DoH agent
      '/supabase-proxy': {
        target: `https://${supabaseHostname}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-proxy/, ''),
        agent: upstreamAgent,
        secure: true
      }
    }
  }
})
