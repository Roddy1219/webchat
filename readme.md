# 在线聊天

## 启动方式

supervisor启动服务，启动脚本`scripts/supervisord`

## todo list

1. 添加多频道聊天
> 频道信息保存在redis，每个频道一个key，对应的value为redis的hash数据，hash数据的key对应用户id，value对应用户名。

2. 添加发送表情包功能
> 表情包插件参考references

3. 添加发送图片功能

4. 添加服务器保存聊天日志
> 服务器保存聊天日志到mongodb，保存方式为两种，一种是定时保存，另一种是按缓存日志量大小执行保存动作。

## references

- [表情插件](http://www.helloweba.com/view-blog-202.html)