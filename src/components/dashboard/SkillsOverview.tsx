import React, { useMemo } from 'react';
import { Employee } from '../../types/employee';
import { Skill } from '../../types/skill';
import Card from '../common/Card';

interface SkillsOverviewProps {
  employees: Employee[];
  skills: Skill[];
}

const SkillsOverview: React.FC<SkillsOverviewProps> = ({
  employees,
  skills,
}) => {
  // Calculate skills distribution
  const skillsData = useMemo(() => {
    const skillsMap = new Map<string, {
      skill: Skill;
      count: number;
      employees: Employee[];
    }>();

    // Initialize with all skills
    skills.forEach((skill) => {
      skillsMap.set(skill.id, {
        skill,
        count: 0,
        employees: [],
      });
    });

    // Count employees with each skill
    employees.forEach((employee) => {
      (employee.skills || []).forEach((skillId) => {
        const entry = skillsMap.get(typeof skillId === 'string' ? skillId : skillId.id);
        if (entry) {
          entry.count += 1;
          entry.employees.push(employee);
        }
      });
    });

    // Convert to array and sort by count (descending)
    return Array.from(skillsMap.values())
      .sort((a, b) => b.count - a.count);
  }, [employees, skills]);

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const categories = new Map<string, {
      category: string;
      skills: typeof skillsData;
    }>();

    skillsData.forEach((skillData) => {
      const category = skillData.skill.category;
      if (!categories.has(category)) {
        categories.set(category, {
          category,
          skills: [],
        });
      }
      
      const categoryData = categories.get(category);
      if (categoryData) {
        categoryData.skills.push(skillData);
      }
    });

    return Array.from(categories.values())
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [skillsData]);

  return (
    <Card title="Skills Overview">
      <div className="space-y-8">
        {skillsByCategory.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No skills data available.
          </div>
        ) : (
          skillsByCategory.map(({ category, skills }) => (
            <div key={category} className="space-y-3">
              <h3 className="font-medium text-gray-900">{category}</h3>
              <div className="space-y-2">
                {skills.map(({ skill, count, employees }) => (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                        {skill.level && (
                          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                            {skill.level}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {count} {count === 1 ? 'employee' : 'employees'}
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${Math.min(100, (count / employees.length) * 100)}%`,
                        }}
                      />
                    </div>
                    {count > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {employees.slice(0, 5).map((employee) => (
                          <span
                            key={employee.id}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                            title={employee.name}
                          >
                            {employee.name}
                          </span>
                        ))}
                        {employees.length > 5 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                            +{employees.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default SkillsOverview;