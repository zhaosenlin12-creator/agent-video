# 下载 Pexels 真实视频的参考脚本（手动按需运行）

本仓库自带 2 段示例视频：
- public/pexels/7106862_actual_launch_vertical.mp4  (28.7 MB)
- public/pexels/7106839_success_run.mp4            ( 7.7 MB)

如果做新内容需要替换，参考下面的步骤：

## 方法 A：浏览器手动下载（推荐，简单）

1. 打开 https://www.pexels.com/zh-cn/
2. 搜索关键词，例如 "rocket launch"、"students running"、"volcano experiment"
3. 筛选 Orientation = Portrait
4. 选 5-10 秒的 CC0 视频
5. 下载 mp4，重命名后放到 public/pexels/
6. 在 src/data.ts 的 videoSrc 字段更新文件名

## 方法 B：Pexels API 批量下载（脚本化）

```powershell
# 1. 去 https://www.pexels.com/api/ 注册拿 API Key
# 2. 设置环境变量
$env:PEXELS_API_KEY = "your_api_key_here"

# 3. 搜索竖屏视频
$headers = @{ Authorization = $env:PEXELS_API_KEY }
$query = "rocket launch"
$res = Invoke-RestMethod -Uri "https://api.pexels.com/videos/search?query=$query&per_page=5&orientation=portrait" -Headers $headers

# 4. 列出可用视频
$res.videos | ForEach-Object {
  Write-Host "$($_.id)  $($_.duration)s  $($_.url)"
  # 找最佳 mp4 文件
  $best = $_.video_files | Where-Object { $_.width -ge 720 -and $_.file_type -eq "video/mp4" } | Select-Object -First 1
  if ($best) {
    Invoke-WebRequest -Uri $best.link -OutFile "public/pexels/$($_.id)_$($query -replace ' ','_').mp4"
  }
}
```

## 注意事项

- 必须竖屏（1080x1920 或 9:16 比例），横屏会被裁剪
- 时长建议 5-10s，能做 Ken Burns 平移
- 文件大小控制在 30 MB 以内（不超 GitHub 单文件 100 MB 限制）
- 命名格式：`<pexels_id>_<关键词>.mp4`
