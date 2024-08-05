const templates = {
  'zh-CN': [
    {
      title: '工作任务',
      description: '工作任务模板',
      content: `<h1>工作任务</h1><h3>任务名称：</h3><p>[任务的简短描述]</p><h3>负责人：</h3><p>[执行任务的个人姓名]</p><h3>截止日期：</h3><p>[任务需要完成的日期]</p><h3>任务详情：</h3><ol><li>[任务步骤1]</li><li>[任务步骤2]</li><li>[任务步骤3]...</li></ol><h3>目标：</h3><p>[任务需要达成的具体目标或结果]</p><h3>备注：</h3><p>[任何额外信息或注意事项]</p>`,
    },
    {
      title: '工作周报',
      description: '工作周报模板',
      content: `<h1>工作周报</h1><h2>本周工作总结</h2><hr /><h3>已完成工作：</h3><ul><li>[任务1名称]：[简要描述任务内容及完成情况]</li><li>[任务2名称]：[简要描述任务内容及完成情况]</li><li>...</li></ul><h3>进行中工作：</h3><ul><li>[任务1名称]：[简要描述任务当前进度和下一步计划]</li><li>[任务2名称]：[简要描述任务当前进度和下一步计划]</li><li>...</li></ul><h3>问题与挑战：</h3><ul><li>[问题1]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>[问题2]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>...</li></ul><hr /><h2>下周工作计划</h2><h3>计划开展工作：</h3><ul><li>[任务1名称]：[简要描述下周计划开始的任务内容]</li><li>[任务2名称]：[简要描述下周计划开始的任务内容]</li><li>...</li></ul><h3>需要支持与资源：</h3><ul><li>[资源1]：[描述需要的资源或支持]</li><li>[资源2]：[描述需要的资源或支持]</li><li>...</li></ul>`,
    },
  ],
  'en-US': [
    {
      title: 'Task Assignment',
      description: 'Task Assignment Template',
      content: `<h1>Task Assignment</h1><h3>Task Name:</h3><p>[Brief description of the task]</p><h3>Responsible Party:</h3><p>[Name of the individual executing the task]</p><h3>Due Date:</h3><p>[Date the task needs to be completed by]</p><h3>Task Details:</h3><ol><li>[Step 1 of the task]</li><li>[Step 2 of the task]</li><li>[Step 3 of the task]...</li></ol><h3>Objective:</h3><p>[Specific goal or outcome the task aims to achieve]</p><h3>Notes:</h3><p>[Any additional information or notes]</p>`,
    },
    {
      title: 'Weekly Work Report',
      description: 'Weekly Work Report Template',
      content: `<h1>Weekly Work Report</h1><h2>Summary of This Week's Work</h2><hr /><h3>Completed Tasks:</h3><ul><li>[Task 1 Name]: [Briefly describe the task and completion status]</li><li>[Task 2 Name]: [Briefly describe the task and completion status]</li><li>...</li></ul><h3>Ongoing Tasks:</h3><ul><li>[Task 1 Name]: [Briefly describe the current progress and next steps]</li><li>[Task 2 Name]: [Briefly describe the current progress and next steps]</li><li>...</li></ul><h3>Challenges & Issues:</h3><ul><li>[Issue 1]: [Describe the issue and current solution or needed support]</li><li>[Issue 2]: [Describe the issue and current solution or needed support]</li><li>...</li></ul><hr /><h2>Next Week's Work Plan</h2><h3>Scheduled Tasks:</h3><ul><li>[Task 1 Name]: [Briefly describe the task content planned for next week]</li><li>[Task 2 Name]: [Briefly describe the task content planned for next week]</li><li>...</li></ul><h3>Needed Support & Resources:</h3><ul><li>[Resource 1]: [Describe the required resource or support]</li><li>[Resource 2]: [Describe the required resource or support]</li><li>...</li></ul>`,
    },
  ],
}

export default templates
