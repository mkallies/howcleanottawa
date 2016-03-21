select businesses.business_id, businesses.name, address, inspections.score, inspections.date, v.code, v.description
from businesses
inner join inspections on inspections.business_id = businesses.business_id
inner join violations v on v.business_id = businesses.business_id
order by name;


select b.name, 
b.address, 
  count(v.business_id) violation_count
from businesses b
  inner join inspections i on i.business_id = b.business_id
  inner join violations v on v.business_id = b.business_id
where 1=1
  AND b.name LIKE 'MCDONALD%' OR 1=1 OR ''=''
group by b.name , b.address
--having count(v.business_id) > 1500
order by count(v.business_id) desc

  