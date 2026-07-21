const fs = require('fs');
const file = './App.tsx';
let code = fs.readFileSync(file, 'utf8');

const importStatement = `import { Loader2 } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';`;

code = code.replace("import { Loader2 } from 'lucide-react';", importStatement);

const appComponent = `const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <HashRouter>
          <Routes>
            <Route path="/" element={<PublicDashboard />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/operator-dashboard" element={
               <OperatorDashboard />
            } />
            
            <Route path="/apps" element={
              <ProtectedRoute>
                <AppsMenu />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
               <React.Fragment>
                  <SharedProfileWrapper />
               </React.Fragment>
            } />
            
            <Route path="/jurnal" element={
               <ProtectedRoute>
                  <JurnalForm />
               </ProtectedRoute>
            } />
            
            <Route path="/jadwal" element={
               <ProtectedRoute>
                  <MySchedule />
               </ProtectedRoute>
            } />

            <Route path="/rekap-absensi" element={
               <ProtectedRoute>
                  <RekapAbsensi />
               </ProtectedRoute>
            } />

            <Route path="/absensi-rapor" element={
               <ProtectedRoute>
                  <AbsensiRapor />
               </ProtectedRoute>
            } />

            <Route path="/laporan" element={
               <ProtectedRoute>
                  <LaporanJurnal />
               </ProtectedRoute>
            } />
            
             <Route path="/kedisiplinan" element={
               <ProtectedRoute>
                  <Kedisiplinan />
               </ProtectedRoute>
            } />

            <Route path="/kinerja" element={
               <ProtectedRoute>
                  <KinerjaGuru />
               </ProtectedRoute>
            } />

            <Route path="/rekap-dhuha" element={
               <ProtectedRoute>
                  <RekapDhuha />
               </ProtectedRoute>
            } />

            <Route path="/import-data" element={
               <AdminRoute>
                  <ImportData />
               </AdminRoute>
            } />

            <Route path="/input-jadwal" element={
               <AdminRoute>
                  <InputJadwal />
               </AdminRoute>
            } />

            <Route path="/input-manual" element={
               <AdminRoute>
                  <InputManual />
               </AdminRoute>
            } />
            
             <Route path="/users" element={
               <AdminRoute>
                  <UsersData />
               </AdminRoute>
            } />

            <Route path="/students" element={
               <AdminRoute>
                  <StudentsData />
               </AdminRoute>
            } />
            
             <Route path="/penyimpanan" element={
               <AdminRoute>
                 <Penyimpanan />
               </AdminRoute>
             } />
             
             <Route path="/settings" element={
               <AdminRoute>
                  <SettingsPage />
               </AdminRoute>
            } />

            {/* Placeholders for other routes */}
            <Route path="/qr" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
       <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};`;

code = code.replace(/const App: React\.FC = \(\) => \{[\s\S]*?  \);\n\};/g, appComponent);

fs.writeFileSync(file, code);
