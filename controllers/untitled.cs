using System;
using System.Collection.Generic;

namespace homework 
{
	public class User 
	{
		public string Username;
		public string Password;
		public string Email;
		public int Role;
	}
	class Program 
	{
		static void Main ()
		{
			var users = new List<User>();
			users.Add(new User { Username = "Yuuko", Password = "123456", Email = "yuuko@qq.com", Role = 0 });
			users.Add(new User { Username = "Amamiya", Password = "654321", Email = "amamiya@163.com", Role = 0 });
			users.Add(new User { Username = "Yuno", Password = "666888", Email = "yuno@4321.io", Role = 1 });
			users.Add(new User { Username = "Gasai", Password = "888999", Email = "gasai@189.cn", Role = 2 });
			Console.WriteLine("请输入用户名");
			var username = Console.ReadLine();
			Console.WriteLine("请输入电子邮箱");
			var email = Console.ReadLine();
			if (users.Any(x => x.Username == username || x.Email == email))
				Console.WriteLine("用户名或邮箱已存在");
			else 
				Console.WriteLine("恭喜您，用户名和邮箱校验通过");
			Console.ReadKey();
		}
	}
}
