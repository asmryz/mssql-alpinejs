## Recapsheet Grade Analysis
```sql
SELECT *,  CAST(total AS FLOAT) * 100 / CAST(x AS FLOAT) Per
FROM (
	SELECT * , (
		SELECT SUM(total)
		FROM (
			SELECT g.grade, COUNT(g.grade) total 
			FROM cmarks m, grade g
			WHERE rid = A.rid
			AND hid = 246
			AND ROUND(marks, 0) BETWEEN g.start AND g.[end]
			GROUP BY g.grade
		) B
	) x
	FROM (
	SELECT rid, g.grade, COUNT(g.grade) total 
	FROM cmarks m, grade g
	WHERE m.rid = 2000
	AND hid = 246
	AND ROUND(marks, 0) BETWEEN g.start AND g.[end]
	GROUP BY m.rid, g.grade
	) A
) C
```
