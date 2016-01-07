/**
 * Created by alex on 16/1/6.
 */
Ext.define('mdaapp.view.ScheduleTimeWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.Date',
        'Ext.form.field.Time'
    ],
    /*
     Uncomment to give this component an xtype
     xtype: 'timeinput',
     */
    layout: {
        type: 'auto',
        align: 'center'
    },
    style: {
        align: 'center'
    },
    width: 320,
    title: '选择预约执行时间',
    padding: '20px 20px ',
    renderTo: Ext.getBody(),
    closable: false,
    inputTime: null,
    onConfirm: null,
    items: [
        {
            xtype: 'datefield',
            fieldLabel: '日期',
            anchor: '100%',
            id: 'schedule_date',
            format: 'Y-m-d',
            minValue: new Date()  // limited to the current date or prior
        },
        {
            xtype: 'timefield',
            fieldLabel: '时间',
            id: 'schedule_time',
            minValue: '00:00 AM',
            maxValue: '23:59 PM',
            increment: 30,
            anchor: '100%'
        },
        {
            xtype: 'button',
            text: '预约执行',
            width: 100,
            margin: '10px auto 10px 20px',
            name: 'confirm',
            handler: function () {
                var date = Ext.getCmp('schedule_date').getValue();
                var time = Ext.getCmp('schedule_time').getValue();
                if (!date || !time)
                    return;
                var scheduleTime = Ext.Date.format(date, 'Ymd') + Ext.Date.format(time, 'His');
                this.up().inputTime = scheduleTime;
                if (this.up().onConfirm) {
                    this.up().onConfirm();
                    this.up().close();
                }
            }
        },
        {
            xtype: 'button',
            text: '取消',
            width: 100,
            margin: '10px auto 10px 20px',
            name: 'cancel',
            handler: function () {
                this.up().close();
            }
        }
        /* include child components here */
    ]
});