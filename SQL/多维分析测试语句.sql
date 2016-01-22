--多维分析测试语句，此语句为业务人员实际使用的一个分析任务例子
SELECT a.cmcc_prov_prvd_id
	,b.branch_name
	,CASE 
		WHEN mer_tot_fee >= 0
			AND mer_tot_fee <= 10
			THEN '分档1:0-10'
		WHEN mer_tot_fee > 10
			AND mer_tot_fee <= 20
			THEN '分档2:10-20'
		WHEN mer_tot_fee > 20
			AND mer_tot_fee <= 50
			THEN '分档3:20-50'
		WHEN mer_tot_fee > 50
			THEN '分档4:50以上'
		END
	,count(*)
FROM (
	SELECT *
	FROM dwbview.RP_STAR_SERVICE_DIMENSION_MON
	WHERE statis_mon = '201510'
		AND mer_tot_fee >= 0
	) a
LEFT JOIN (
	SELECT *
	FROM dwbview.branch
	) b ON a.cmcc_prov_prvd_id = b.branch_id
GROUP BY a.cmcc_prov_prvd_id
	,b.branch_name
	,CASE 
		WHEN mer_tot_fee >= 0
			AND mer_tot_fee <= 10
			THEN '分档1:0-10'
		WHEN mer_tot_fee > 10
			AND mer_tot_fee <= 20
			THEN '分档2:10-20'
		WHEN mer_tot_fee > 20
			AND mer_tot_fee <= 50
			THEN '分档3:20-50'
		WHEN mer_tot_fee > 50
			THEN '分档4:50以上'
		END
ORDER BY a.cmcc_prov_prvd_id
	,CASE 
		WHEN mer_tot_fee >= 0
			AND mer_tot_fee <= 10
			THEN '分档1:0-10'
		WHEN mer_tot_fee > 10
			AND mer_tot_fee <= 20
			THEN '分档2:10-20'
		WHEN mer_tot_fee > 20
			AND mer_tot_fee <= 50
			THEN '分档3:20-50'
		WHEN mer_tot_fee > 50
			THEN '分档4:50以上'
		END;
