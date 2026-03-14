<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Permissions
        $permissions = [
            'view residents', 'create residents', 'edit residents', 'delete residents',
            'view documents', 'create documents', 'process documents', 'print documents',
            'view blotter', 'create blotter', 'manage blotter',
            'manage users', 'view reports',
        ];
        foreach ($permissions as $p) Permission::create(['name' => $p]);

        // Roles
        Role::create(['name' => 'Admin'])->givePermissionTo(Permission::all());

        Role::create(['name' => 'Barangay Secretary'])->givePermissionTo([
            'view residents', 'create residents', 'edit residents',
            'view documents', 'create documents', 'process documents', 'print documents',
            'view blotter',
        ]);

        Role::create(['name' => 'Barangay Tanod'])->givePermissionTo([
            'view residents',
            'view blotter', 'create blotter', 'manage blotter',
        ]);

        Role::create(['name' => 'Desk Officer'])->givePermissionTo([
            'view residents',
            'view documents', 'create documents', 'process documents', 'print documents',
        ]);

        // Default Admin account
        User::create([
            'name'     => 'System Admin',
            'email'    => 'admin@barangay.gov.ph',
            'password' => bcrypt('Admin@1234'),
        ])->assignRole('Admin');
    }
}